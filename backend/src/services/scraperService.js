// ============================================================
//  RoastFolio — Scraper Service (Production/Serverless safe)
//  Uses fetch + Cheerio for static sites
//  Uses ScrapingBee free tier for JS-rendered SPAs
//  No Puppeteer — works on Vercel serverless
// ============================================================
import * as cheerio from "cheerio";

// ── GitHub API ────────────────────────────────────────────────
async function fetchGitHubData(username) {
  try {
    const headers = {
      "User-Agent": "RoastFolioBot/1.0",
      "Accept":     "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`,
        { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=10&type=public`,
        { headers, signal: AbortSignal.timeout(8000) }),
    ]);

    if (!userRes.ok) return null;
    const user  = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    const repoSummaries = Array.isArray(repos)
      ? repos.filter(r => !r.fork).map(r => ({
          name:        r.name,
          description: r.description || "No description",
          language:    r.language    || "Unknown",
          stars:       r.stargazers_count,
          forks:       r.forks_count,
          last_pushed: r.pushed_at?.split("T")[0],
          url:         r.html_url,
        }))
      : [];

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) : 0;

    const languageCount = {};
    Array.isArray(repos) && repos.forEach(r => {
      if (r.language) languageCount[r.language] = (languageCount[r.language] || 0) + 1;
    });
    const topLanguages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([lang]) => lang);

    const ageYears = ((Date.now() - new Date(user.created_at))
      / (1000*60*60*24*365)).toFixed(1);

    return {
      username,
      name:              user.name || username,
      bio:               user.bio  || "",
      public_repos:      user.public_repos || 0,
      followers:         user.followers    || 0,
      total_stars:       totalStars,
      top_languages:     topLanguages,
      account_age_years: parseFloat(ageYears),
      repos:             repoSummaries,
      most_starred_repo: [...repoSummaries].sort((a,b) => b.stars - a.stars)[0]?.name || "None",
      non_fork_repos:    repoSummaries.length,
      last_activity:     repoSummaries[0]?.last_pushed || "Unknown",
      profile_url:       `https://github.com/${username}`,
    };
  } catch (err) {
    console.warn(`GitHub API failed for ${username}:`, err.message);
    return null;
  }
}

// ── Scrape with Jina AI (free, renders JS, no API key needed) ─
// Jina Reader API: prefix any URL with https://r.jina.ai/
// Returns clean markdown text — works for SPAs, free forever
async function scrapeWithJina(url) {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(jinaUrl, {
      headers: {
        "User-Agent": "RoastFolioBot/1.0",
        "Accept":     "text/plain",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.slice(0, 8000); // Jina returns markdown
  } catch (err) {
    console.warn(`Jina scrape failed for ${url}:`, err.message);
    return null;
  }
}

// ── Fast scrape with Cheerio (static/GitHub pages) ───────────
async function scrapeWithCheerio(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RoastFolioBot/1.0)" },
    signal:  AbortSignal.timeout(10000),
  });
  const html = await res.text();
  const $    = cheerio.load(html);
  const title = $("title").text().trim();
  $("script, style, nav, footer").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return { text, title, html };
}

// ── Smart scrape — tries Cheerio first, Jina as fallback ─────
async function smartScrape(url) {
  // GitHub repos/profiles — use Cheerio (static HTML, fast)
  if (url.includes("github.com")) {
    try {
      const result = await scrapeWithCheerio(url);
      return { text: result.text, title: result.title, html: result.html };
    } catch {
      return { text: "", title: "", html: "" };
    }
  }

  // For all other sites — try Cheerio first
  try {
    const cheerioResult = await scrapeWithCheerio(url);
    // If we got enough content, use it
    if (cheerioResult.text.length > 300) {
      return { text: cheerioResult.text, title: cheerioResult.title, html: cheerioResult.html };
    }
    // Content too short = SPA that needs JS rendering
    // Fall through to Jina
    console.log(`[Scraper] Short content (${cheerioResult.text.length} chars), trying Jina AI`);
  } catch (err) {
    console.warn(`[Scraper] Cheerio failed: ${err.message}`);
  }

  // Jina AI — free, renders JavaScript, returns clean text
  const jinaText = await scrapeWithJina(url);
  if (jinaText) {
    return { text: jinaText, title: "", html: "" };
  }

  return { text: "", title: "", html: "" };
}

// ── Main scraper export ───────────────────────────────────────
export async function scrapePortfolio(url, resumeText = "") {
  try {
    const { text: rawText, title: pageTitle, html } = await smartScrape(url);
    const $ = html ? cheerio.load(html) : null;

    // Extract headings as project candidates
    const projectsFound = [];
    if ($) {
      $("h1, h2, h3").each((_, el) => {
        const t = $(el).text().trim();
        if (t.length > 3 && t.length < 80) projectsFound.push(t);
      });
    } else {
      // Extract from markdown text (Jina output)
      const headingMatches = rawText.match(/^#{1,3}\s+(.+)$/gm) || [];
      headingMatches.forEach(h => {
        const t = h.replace(/^#+\s+/, "").trim();
        if (t.length > 3 && t.length < 80) projectsFound.push(t);
      });
    }

    // Extract links
    const linksFound = [];
    if ($) {
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (href?.startsWith("http")) linksFound.push(href);
      });
    }
    const uniqueLinks = [...new Set(linksFound)];

    // Tech stack detection from combined text
    const techKeywords = [
      "React","Vue","Angular","Next.js","Node","Express","Python","Django",
      "TypeScript","JavaScript","PostgreSQL","MongoDB","Redis","Docker",
      "AWS","Tailwind","GraphQL","REST","FastAPI","Spring","Laravel",
      "C++","Java","Kotlin","Swift","Flutter","Firebase","Supabase",
      "Machine Learning","TensorFlow","PyTorch","Scikit","IoT","Arduino",
      "Vite","Prisma","tRPC","Remix","Astro","Svelte","Nuxt","Bayesian",
    ];
    const combined = rawText + " " + resumeText;
    const techStackMentions = techKeywords.filter(t =>
      combined.toLowerCase().includes(t.toLowerCase())
    );

    // GitHub username detection
    const githubLink     = uniqueLinks.find(l => l.includes("github.com/"));
    const fromLink       = githubLink?.split("github.com/")[1]?.split("/")[0];
    const fromText       = combined.match(/github\.com\/([a-zA-Z0-9_-]+)/i)?.[1];
    const githubFromUrl  = url.includes("github.com/")
      ? url.split("github.com/")[1]?.split("/")[0] : null;
    const finalUsername  = fromLink || fromText || githubFromUrl || null;

    // Fetch real GitHub data
    const githubData = finalUsername ? await fetchGitHubData(finalUsername) : null;

    return {
      url,
      pageTitle,
      rawText:          rawText.slice(0, 5000),
      projectsFound:    [...new Set(projectsFound)].slice(0, 10),
      techStackMentions,
      linksFound:       uniqueLinks.slice(0, 20),
      hasLiveDemos:     combined.toLowerCase().includes("vercel") ||
                        combined.toLowerCase().includes("netlify") ||
                        combined.toLowerCase().includes("live demo") ||
                        combined.toLowerCase().includes("demo"),
      wordCount:        rawText.split(" ").length,
      githubUsername:   finalUsername,
      githubData,
    };
  } catch (err) {
    console.warn(`Scrape failed for ${url}:`, err.message);
    const fromResume = resumeText.match(/github\.com\/([a-zA-Z0-9_-]+)/i)?.[1];
    const githubData = fromResume ? await fetchGitHubData(fromResume) : null;
    return {
      url, rawText: "", projectsFound: [], techStackMentions: [],
      linksFound: [], wordCount: 0,
      githubUsername: fromResume || null, githubData,
    };
  }
}

// ── PDF-only path ─────────────────────────────────────────────
export async function extractFromResumeOnly(resumeText) {
  const techKeywords = [
    "React","Vue","Angular","Next.js","Node","Express","Python","Django",
    "TypeScript","JavaScript","PostgreSQL","MongoDB","Redis","Docker",
    "AWS","Tailwind","GraphQL","REST","FastAPI","Spring","Laravel",
    "C++","Java","Kotlin","Swift","Flutter","Firebase","Supabase",
    "Machine Learning","TensorFlow","PyTorch","Scikit","IoT","Arduino",
  ];

  const techStackMentions = techKeywords.filter(t =>
    resumeText.toLowerCase().includes(t.toLowerCase())
  );

  const githubUsername = resumeText.match(/github\.com\/([a-zA-Z0-9_-]+)/i)?.[1] || null;
  const githubData     = githubUsername ? await fetchGitHubData(githubUsername) : null;

  const projectLines = resumeText.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 5 && l.length < 80 && /^[A-Z]/.test(l));

  return {
    url: null, pageTitle: null,
    rawText:          resumeText.slice(0, 5000),
    projectsFound:    projectLines.slice(0, 10),
    techStackMentions,
    linksFound:       [],
    hasLiveDemos:     resumeText.toLowerCase().includes("vercel") ||
                      resumeText.toLowerCase().includes("live demo"),
    wordCount:        resumeText.split(" ").length,
    githubUsername,
    githubData,
  };
}