// ============================================================
//  RoastFolio — Scraper Service v3
//  Uses Puppeteer for JS-rendered sites (React/Vue/Next apps)
//  Falls back to Cheerio for static sites (fast path)
// ============================================================
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

// ── GitHub API ────────────────────────────────────────────────
async function fetchGitHubData(username) {
  try {
    const headers = {
      "User-Agent": "RoastFolioBot/1.0",
      "Accept": "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=10&type=public`, { headers, signal: AbortSignal.timeout(8000) }),
    ]);

    if (!userRes.ok) return null;
    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    const repoSummaries = Array.isArray(repos)
      ? repos.filter(r => !r.fork).map(r => ({
        name: r.name,
        description: r.description || "No description",
        language: r.language || "Unknown",
        stars: r.stargazers_count,
        forks: r.forks_count,
        last_pushed: r.pushed_at?.split("T")[0],
        url: r.html_url,
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

    const ageYears = ((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

    return {
      username,
      name: user.name || username,
      bio: user.bio || "",
      public_repos: user.public_repos || 0,
      followers: user.followers || 0,
      total_stars: totalStars,
      top_languages: topLanguages,
      account_age_years: parseFloat(ageYears),
      repos: repoSummaries,
      most_starred_repo: [...repoSummaries].sort((a, b) => b.stars - a.stars)[0]?.name || "None",
      non_fork_repos: repoSummaries.length,
      last_activity: repoSummaries[0]?.last_pushed || "Unknown",
      profile_url: `https://github.com/${username}`,
    };
  } catch (err) {
    console.warn(`GitHub API failed for ${username}:`, err.message);
    return null;
  }
}

// ── Fast scrape with Cheerio (static sites) ───────────────────
async function scrapeWithCheerio(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RoastFolioBot/1.0)" },
    signal: AbortSignal.timeout(10000),
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, nav, footer").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return { html, text, title: $("title").text().trim() };
}

// ── Full scrape with Puppeteer (React/Vue/SPA sites) ──────────
async function scrapeWithPuppeteer(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (compatible; RoastFolioBot/1.0)");

    // Wait for network to settle after React renders
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });

    // Extra wait for lazy-loaded content
    await new Promise(r => setTimeout(r, 2000));

    const title = await page.title();
    const text = await page.evaluate(() => {
      // Remove noise elements
      ["script", "style", "nav", "footer", "header"].forEach(tag => {
        document.querySelectorAll(tag).forEach(el => el.remove());
      });
      return document.body?.innerText?.replace(/\s+/g, " ")?.trim() || "";
    });

    const html = await page.content();
    return { html, text, title };
  } finally {
    if (browser) await browser.close();
  }
}

// ── Detect if site needs Puppeteer ───────────────────────────
async function detectAndScrape(url) {
  // Always use Puppeteer for known SPA hosting platforms
  const needsPuppeteer = [
    "vercel.app", "netlify.app", "herokuapp.com",
    "pages.dev", "github.io", "render.com",
  ].some(host => url.includes(host));

  if (needsPuppeteer) {
    console.log(`[Scraper] Using Puppeteer for: ${url}`);
    try {
      return await scrapeWithPuppeteer(url);
    } catch (err) {
      console.warn("[Scraper] Puppeteer failed, falling back to Cheerio:", err.message);
      return await scrapeWithCheerio(url);
    }
  }

  // Try Cheerio first (fast)
  const result = await scrapeWithCheerio(url);

  // If page text is very short (<200 chars), it's probably a SPA — retry with Puppeteer
  if (result.text.length < 200) {
    console.log(`[Scraper] Short content (${result.text.length} chars), retrying with Puppeteer`);
    try {
      return await scrapeWithPuppeteer(url);
    } catch {
      return result; // return whatever Cheerio got
    }
  }

  return result;
}

// ── Main scraper export ───────────────────────────────────────
export async function scrapePortfolio(url, resumeText = "") {
  try {
    const { html, text: rawText, title: pageTitle } = await detectAndScrape(url);
    const $ = cheerio.load(html);

    // Extract headings as project candidates
    const projectsFound = [];
    $("h1, h2, h3").each((_, el) => {
      const t = $(el).text().trim();
      if (t.length > 3 && t.length < 80) projectsFound.push(t);
    });

    // Extract links
    const linksFound = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href?.startsWith("http")) linksFound.push(href);
    });
    const uniqueLinks = [...new Set(linksFound)];

    // Tech stack detection
    const techKeywords = [
      "React", "Vue", "Angular", "Next.js", "Node", "Express", "Python", "Django",
      "TypeScript", "JavaScript", "PostgreSQL", "MongoDB", "Redis", "Docker",
      "AWS", "Tailwind", "GraphQL", "REST", "FastAPI", "Spring", "Laravel",
      "C++", "Java", "Kotlin", "Swift", "Flutter", "Firebase", "Supabase",
      "Machine Learning", "TensorFlow", "PyTorch", "Scikit", "IoT", "Arduino",
      "Vite", "Prisma", "tRPC", "Remix", "Astro", "SvelteKit", "Nuxt",
    ];
    const combined = rawText + " " + resumeText;
    const techStackMentions = techKeywords.filter(t =>
      combined.toLowerCase().includes(t.toLowerCase())
    );

    // GitHub detection
    const githubLink = uniqueLinks.find(l => l.includes("github.com/"));
    const fromLink = githubLink?.split("github.com/")[1]?.split("/")[0];
    const fromText = combined.match(/github\.com\/([a-zA-Z0-9_-]+)/i)?.[1];
    const githubUsername = fromLink || fromText || null;

    // If URL is itself a GitHub profile
    const githubFromUrl = url.includes("github.com/")
      ? url.split("github.com/")[1]?.split("/")[0]
      : null;
    const finalUsername = githubUsername || githubFromUrl || null;

    // Fetch real GitHub data
    const githubData = finalUsername ? await fetchGitHubData(finalUsername) : null;

    return {
      url,
      pageTitle,
      rawText: rawText.slice(0, 5000),
      projectsFound: [...new Set(projectsFound)].slice(0, 10),
      techStackMentions,
      linksFound: uniqueLinks.slice(0, 20),
      hasLiveDemos: uniqueLinks.some(l =>
        l.includes("vercel") || l.includes("netlify") ||
        l.includes("herokuapp") || l.includes("pages.dev")
      ),
      wordCount: rawText.split(" ").length,
      githubUsername: finalUsername,
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
    "React", "Vue", "Angular", "Next.js", "Node", "Express", "Python", "Django",
    "TypeScript", "JavaScript", "PostgreSQL", "MongoDB", "Redis", "Docker",
    "AWS", "Tailwind", "GraphQL", "REST", "FastAPI", "Spring", "Laravel",
    "C++", "Java", "Kotlin", "Swift", "Flutter", "Firebase", "Supabase",
    "Machine Learning", "TensorFlow", "PyTorch", "Scikit", "IoT", "Arduino",
  ];

  const techStackMentions = techKeywords.filter(t =>
    resumeText.toLowerCase().includes(t.toLowerCase())
  );

  const githubUsername = resumeText.match(/github\.com\/([a-zA-Z0-9_-]+)/i)?.[1] || null;
  const githubData = githubUsername ? await fetchGitHubData(githubUsername) : null;

  const projectLines = resumeText.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 5 && l.length < 80 && /^[A-Z]/.test(l));

  return {
    url: null, pageTitle: null,
    rawText: resumeText.slice(0, 5000),
    projectsFound: projectLines.slice(0, 10),
    techStackMentions,
    linksFound: [],
    hasLiveDemos: false,
    wordCount: resumeText.split(" ").length,
    githubUsername,
    githubData,
  };
}