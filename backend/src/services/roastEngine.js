// ============================================================
//  RoastFolio — Roast Engine v3
//  Fix: strict JSON schema enforcement for Qwen
// ============================================================
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODE_PERSONAS = {
  unhinged: `You are a feral, unhinged AI that has seen 100,000 bad portfolios and completely lost it.
You use ALL CAPS for emphasis. You use words like "bruh", "bro", "no cap", "deadass", "ratio", "L", "mid", "cooked".
You make dramatic comparisons like "this GitHub is emptier than my will to live".
You NAME their actual projects and drag them specifically.
Every criticism is 100% real and backed by actual data from their portfolio.
You are NOT professional. You are NOT polite. You are NOT an assistant. You ROAST.`,

  brutal: `You are a cold, ruthless FAANG senior engineer. Zero warmth. Zero patience.
Short sharp sentences like verdicts. You NAME their actual projects.
You are NOT an assistant. You are a judge delivering sentences.`,

  honest: `You are a brutally honest senior mentor. Direct and specific.
You NAME actual projects. Every criticism has a specific fix.
You are NOT an assistant giving generic advice.`,

  soft: `You are a warm encouraging senior developer. Specific and kind.
You NAME their actual wins. You make them feel capable.`,
};

const SYSTEM_MESSAGES = {
  unhinged: `You are RoastFolio UNHINGED. You are NOT an assistant. You ROAST.
CRITICAL JSON RULES — FOLLOW EXACTLY:
1. overall_grade MUST be exactly one of: "S", "A", "B", "C", "D", "F" — no plus or minus
2. scores object MUST have exactly 6 keys, each with "score" (integer) and "verdict" (string)
3. roast_paragraphs MUST be an array of exactly 4 strings
4. instant_wins MUST be an array of exactly 3 strings
5. No trailing commas. No extra fields. Valid JSON only.
Respond with ONLY the raw JSON object. Zero text before or after.`,

  brutal: `You are RoastFolio BRUTAL. You are NOT an assistant.
CRITICAL: overall_grade must be "S","A","B","C","D", or "F" only — no variants.
Respond with ONLY raw valid JSON. Zero text before or after.`,

  honest: `You are RoastFolio HONEST. Direct mentor, not an assistant.
CRITICAL: overall_grade must be "S","A","B","C","D", or "F" only.
Respond with ONLY raw valid JSON. Zero text before or after.`,

  soft: `You are RoastFolio SOFT. Encouraging mentor, not an assistant.
CRITICAL: overall_grade must be "S","A","B","C","D", or "F" only.
Respond with ONLY raw valid JSON. Zero text before or after.`,
};

function buildPrompt(data) {
  const { url, rawText, resumeText, projectsFound, techStackMentions,
    githubUsername, githubData, wordCount, hasLiveDemos, linksFound, mode } = data;

  const projectsBlock = projectsFound?.length
    ? projectsFound.map((p, i) => `  PROJECT_${i + 1}: "${p}"`).join("\n")
    : "  NO PROJECTS DETECTED — roast them for this";

  const techBlock = techStackMentions?.length
    ? techStackMentions.join(", ")
    : "NONE DETECTED";

  // ── Replace the githubBlock section in buildPrompt() with this ──

  const githubBlock = githubData
    ? `
GITHUB PROFILE — github.com/${githubData.username}
  Account age: ${githubData.account_age_years} years
  Public repos: ${githubData.public_repos} (${githubData.non_fork_repos} non-forks)
  Followers: ${githubData.followers}
  Total stars: ${githubData.total_stars}
  Top languages: ${githubData.top_languages?.join(", ") || "None"}
  Last activity: ${githubData.last_activity}
  Most starred repo: ${githubData.most_starred_repo}

  ACTUAL REPOS (roast or praise these specifically):
${githubData.repos?.map(r =>
      `    - ${r.name} (${r.language}) — ${r.stars}★ — last pushed ${r.last_pushed}
       Description: "${r.description}"`
    ).join("\n") || "    No repos found"}
`
    : githubUsername
      ? `GitHub username found (${githubUsername}) but API fetch failed — assume minimal activity`
      : "NOT FOUND ANYWHERE — roast them specifically for having no GitHub presence";

  const modeInstructions = {
    unhinged: `‼️ UNHINGED MODE — Be LOUD, SPECIFIC, and SAVAGE. Use slang. Use ALL CAPS for emphasis.
NAME their actual projects. Make dramatic comparisons. Be genuinely funny.
DO NOT sound like LinkedIn. DO NOT be an assistant.`,
    brutal: `⚔️ BRUTAL MODE — Short verdicts. Name actual projects. Zero fluff.`,
    honest: `🎯 HONEST MODE — Specific and direct. Reference actual projects and skills.`,
    soft: `🌱 SOFT MODE — Warm and specific. Reference actual wins.`,
  };

  return `
${modeInstructions[mode] || modeInstructions.honest}

${MODE_PERSONAS[mode] || MODE_PERSONAS.honest}

════════ DEVELOPER DATA — READ ALL OF THIS ════════

URL: ${url || "NOT PROVIDED"}
WORD COUNT: ${wordCount || 0}
LIVE DEMOS: ${hasLiveDemos ? "YES" : "NO"}
GITHUB: ${githubBlock}

PROJECTS — USE THESE EXACT NAMES IN YOUR ROAST:
${projectsBlock}

TECH STACK: ${techBlock}
LINKS: ${linksFound?.slice(0, 8).join(", ") || "None"}

PORTFOLIO TEXT:
---
${(rawText || "").slice(0, 1800) || "EMPTY"}
---

RESUME TEXT:
---
${(resumeText || "").slice(0, 1800) || "NOT PROVIDED"}
---

════════ RETURN THIS EXACT JSON STRUCTURE ════════

STRICT RULES:
- "overall_grade" MUST be one of exactly: "S" "A" "B" "C" "D" "F" — NO plus/minus, NO other values
- "scores" MUST have EXACTLY these 6 keys: project_quality, description_clarity, tech_stack_depth, github_health, presentation, recruiter_appeal
- Each score entry: {"score": <integer 0-100>, "verdict": "<string>"}
- "roast_paragraphs": array of EXACTLY 4 strings
- "instant_wins": array of EXACTLY 3 strings
- No trailing commas anywhere

{
  "overall_score": <integer 0-100>,
  "overall_grade": <MUST BE EXACTLY "S" or "A" or "B" or "C" or "D" or "F">,
  "one_liner": "<max 20 words, punchy, references their actual situation>",
  "scores": {
    "project_quality":     {"score": <0-100>, "verdict": "<specific — mention actual project names>"},
    "description_clarity": {"score": <0-100>, "verdict": "<specific — reference actual content>"},
    "tech_stack_depth":    {"score": <0-100>, "verdict": "<specific — name their actual stack>"},
    "github_health":       {"score": <0-100>, "verdict": "<specific — address github situation>"},
    "presentation":        {"score": <0-100>, "verdict": "<specific — live demos, portfolio site>"},
    "recruiter_appeal":    {"score": <0-100>, "verdict": "<specific — would recruiter stop scrolling>"}
  },
  "roast_paragraphs": [
    "<overview in ${mode} mode voice — NAME actual projects — be specific>",
    "<genuine wins — name specific things that actually impressed you>",
    "<single biggest problem — name it specifically — no vague statements>",
    "<top 3 numbered actions — specific, doable this week>"
  ],
  "instant_wins": [
    "<specific fix #1 doable under 1 hour — reference their actual project>",
    "<specific fix #2 doable under 1 hour>",
    "<specific fix #3 doable under 1 hour>"
  ],
  "skills_detected": ${JSON.stringify(techStackMentions?.length ? techStackMentions : ["Unknown"])},
  "missing_skills_for_market": ["<skill the market demands that they lack>"],
  "portfolio_archetype": "<MUST BE ONE OF EXACTLY: The Tutorial Collector, The Ghost Dev, The Overclaimer, The Hidden Gem, The Almost There, The Real Deal, The Blank Slate>",
  "share_quote": "<tweet-ready sentence AS RoastFolio ABOUT this dev — ${mode === "unhinged" ? "savage and funny" : "punchy and honest"}>"
}`;
}

// ── Sanitize result — fix common AI mistakes ─────────────────
function sanitizeResult(result) {
  // Fix grade — strip any + or - suffix
  if (result.overall_grade) {
    result.overall_grade = result.overall_grade.replace(/[^SABCDF]/g, "");
    if (!["S", "A", "B", "C", "D", "F"].includes(result.overall_grade)) {
      result.overall_grade = "C"; // safe fallback
    }
  }

  // Fix archetype — map to closest valid value
  const validArchetypes = [
    "The Tutorial Collector", "The Ghost Dev", "The Overclaimer",
    "The Hidden Gem", "The Almost There", "The Real Deal", "The Blank Slate"
  ];
  if (!validArchetypes.includes(result.portfolio_archetype)) {
    result.portfolio_archetype = "The Almost There"; // safe fallback
  }

  // Fix roast_paragraphs — ensure it's an array of 4 strings
  if (!Array.isArray(result.roast_paragraphs)) {
    result.roast_paragraphs = [String(result.roast_paragraphs), "", "", ""];
  }
  while (result.roast_paragraphs.length < 4) result.roast_paragraphs.push("");

  // Fix instant_wins — ensure array of 3
  if (!Array.isArray(result.instant_wins)) {
    result.instant_wins = [String(result.instant_wins), "", ""];
  }
  while (result.instant_wins.length < 3) result.instant_wins.push("Check your README");

  return result;
}

// ── Main export ───────────────────────────────────────────────
export async function generateRoast(portfolioData) {
  const { mode = "honest" } = portfolioData;

  const temperature = {
    unhinged: 1.3,
    brutal: 1.0,
    honest: 0.8,
    soft: 0.7,
  }[mode] || 0.8;

  const completion = await client.chat.completions.create({
    model: "qwen/qwen3-32b",
    temperature,
    max_tokens: 2048,
    messages: [
      { role: "system", content: SYSTEM_MESSAGES[mode] || SYSTEM_MESSAGES.honest },
      { role: "user", content: buildPrompt(portfolioData) },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content || "";

  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    try {
      result = JSON.parse(cleaned);
    } catch {
      throw new Error("AI returned invalid JSON. Please try again.");
    }
  }

  result = sanitizeResult(result);
  result.mode = mode;
  result.portfolio_url = portfolioData.url;
  result.generated_at = new Date().toISOString();
  result.model_used = "qwen/qwen3-32b";

  return result;
}