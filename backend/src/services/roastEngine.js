// ============================================================
//  RoastFolio — Roast Engine v4
//  Fixed: proper calibration, experience-aware scoring,
//  stops penalizing GitHub when portfolio content is rich
// ============================================================
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODE_PERSONAS = {
  unhinged: `You are a feral, unhinged AI career coach who has seen 100,000 portfolios.
You use ALL CAPS for emphasis. You use words like "bruh", "bro", "no cap", "deadass", "ratio", "L", "mid", "cooked".
You make dramatic comparisons. You NAME their actual projects and drag OR hype them.
You are NOT professional. You are NOT polite. You ROAST or HYPE based on what you actually see.
If someone is impressive, you scream about how impressive they are just as loudly as you would roast a weak portfolio.`,

  brutal: `You are a cold, ruthless FAANG senior engineer. Zero warmth.
Short sharp sentences like verdicts. You NAME their actual projects and experience.
You are NOT an assistant. You are a judge. You reward genuine excellence with genuine praise.`,

  honest: `You are a brutally honest senior mentor with 15 years experience.
Direct, specific, fair. You name actual projects and internships.
Senior devs get scored as senior devs. Beginners get scored as beginners.
You calibrate your feedback to their actual experience level.`,

  soft: `You are a warm encouraging senior developer.
Specific and kind. You name their actual wins. You make them feel capable.`,
};

const SYSTEM_MESSAGES = {
  unhinged: `You are RoastFolio UNHINGED. You are NOT an assistant. You react honestly to what you see.
SCORING RULES — READ CAREFULLY:
- Score based on ACTUAL content quality, not what's missing
- If someone has 4 internships including IIT Bombay, their experience score must be HIGH
- GitHub absence does NOT automatically mean low score if portfolio is rich
- A senior dev with real projects and internships cannot score below 60 overall
- Be SPECIFIC — name actual projects, companies, technologies you see
CRITICAL JSON: overall_grade MUST be exactly "S","A","B","C","D", or "F" — no variants
Respond ONLY with raw JSON. Zero text before or after.`,

  brutal: `You are RoastFolio BRUTAL. Score based on ACTUAL content.
Internship experience at real companies = high recruiter appeal.
Real projects with technical depth = high project quality.
overall_grade MUST be "S","A","B","C","D", or "F" only.
Respond ONLY with raw valid JSON.`,

  honest: `You are RoastFolio HONEST. Score calibrated to actual experience level.
IMPORTANT: If the portfolio shows internships at real companies, research experience,
and multiple technical projects — this is a strong candidate. Score accordingly.
overall_grade MUST be "S","A","B","C","D", or "F" only.
Respond ONLY with raw valid JSON.`,

  soft: `You are RoastFolio SOFT. Warm mentor, not an assistant.
overall_grade MUST be "S","A","B","C","D", or "F" only.
Respond ONLY with raw valid JSON.`,
};

function buildPrompt(data) {
  const {
    url, rawText, resumeText, projectsFound, techStackMentions,
    githubUsername, githubData, wordCount, hasLiveDemos, linksFound, mode,
  } = data;

  const projectsBlock = projectsFound?.length
    ? projectsFound.map((p, i) => `  PROJECT_${i + 1}: "${p}"`).join("\n")
    : "  NO PROJECTS DETECTED IN HEADINGS (check raw text for projects)";

  const techBlock = techStackMentions?.length
    ? techStackMentions.join(", ")
    : "None auto-detected — check raw text carefully";

  const githubBlock = githubData
    ? `
GITHUB PROFILE — github.com/${githubData.username}
  Account age: ${githubData.account_age_years} years
  Public repos: ${githubData.public_repos} (${githubData.non_fork_repos} non-forks)
  Followers: ${githubData.followers}
  Total stars: ${githubData.total_stars}
  Top languages: ${githubData.top_languages?.join(", ") || "None"}
  Last activity: ${githubData.last_activity}
  Most starred: ${githubData.most_starred_repo}
  REPOS:
${githubData.repos?.map(r =>
  `    - ${r.name} (${r.language}) — ${r.stars}★ — ${r.last_pushed}
       "${r.description}"`
).join("\n") || "    No repos"}
`
    : githubUsername
      ? `GitHub username detected (${githubUsername}) but data unavailable`
      : `No GitHub link found on portfolio — DO NOT heavily penalize if portfolio content is rich.
         Many senior devs link GitHub from resume not portfolio.`;

  const modeInstructions = {
    unhinged: `‼️ UNHINGED MODE — React to what you ACTUALLY see. If it's impressive, HYPE IT LOUDLY.
If it's weak, DRAG IT. Use slang. Use caps. Be specific. Name actual projects and companies.`,
    brutal:   `⚔️ BRUTAL MODE — Short verdicts. Name actual experience and projects. Fair but cold.`,
    honest:   `🎯 HONEST MODE — Calibrate to their actual level. Senior experience = senior scoring.`,
    soft:     `🌱 SOFT MODE — Warm and specific. Lead with real wins.`,
  };

  return `
${modeInstructions[mode] || modeInstructions.honest}

${MODE_PERSONAS[mode] || MODE_PERSONAS.honest}

════════ DEVELOPER DATA ════════

URL: ${url || "NOT PROVIDED"}
WORD COUNT: ${wordCount || 0}
LIVE DEMOS DETECTED: ${hasLiveDemos ? "YES" : "NO"}
GITHUB: ${githubBlock}

PROJECTS FOUND IN HEADINGS:
${projectsBlock}

TECH STACK DETECTED: ${techBlock}

════════ FULL PORTFOLIO TEXT — READ THIS CAREFULLY ════════
${(rawText || "").slice(0, 4000) || "EMPTY"}
════════ END PORTFOLIO TEXT ════════

${resumeText ? `RESUME TEXT:\n---\n${resumeText.slice(0, 2000)}\n---` : ""}

════════ SCORING CALIBRATION RULES ════════

READ THESE BEFORE SCORING — THEY ARE MANDATORY:

1. EXPERIENCE CALIBRATION:
   - 0 internships + student projects only → max overall score 55
   - 1-2 internships at real companies → min overall score 50, can reach 75
   - 3+ internships OR research experience → min overall score 60, can reach 85
   - Published research paper → +10 bonus to overall
   - IIT/FAANG/top company internship → +10 bonus to recruiter_appeal

2. PROJECT QUALITY:
   - Tutorial clones (todo app, weather app) → score 20-40
   - Real projects with technical depth → score 50-70
   - Projects with live demos AND stars → score 65-80
   - Research-level or novel projects → score 75-90

3. GITHUB HEALTH:
   - If no GitHub link BUT portfolio is rich → score 40-60 (not 0-20)
   - If GitHub found with active repos → score based on actual activity
   - Never give 0 github_health unless portfolio is completely empty

4. RECRUITER APPEAL:
   - Multiple real internships = automatically 50+ recruiter appeal
   - Clean portfolio design with clear nav = +10
   - Live demo links = +10

5. OVERALL GRADE CALIBRATION:
   S (90-100): Exceptional — FAANG-ready, multiple strong projects, great presentation
   A (80-89):  Strong — real internships, solid projects, good presentation
   B (65-79):  Good — some real experience, decent projects, room to grow
   C (50-64):  Average — student-level work, needs improvement
   D (35-49):  Weak — mostly tutorial work, poor presentation
   F (0-34):   Very weak — almost nothing to show

IMPORTANT: After reading the full portfolio text above, identify:
- How many REAL internships/jobs do they have?
- Do they have RESEARCH experience?
- Are their projects technically deep or tutorial-level?
- Then score accordingly. A portfolio with 4 internships and research papers
  CANNOT be a D. That would be a calibration failure.

════════ RETURN EXACTLY THIS JSON ════════

{
  "overall_score": <0-100, calibrated per rules above>,
  "overall_grade": <EXACTLY "S" or "A" or "B" or "C" or "D" or "F">,
  "one_liner": "<max 20 words — specific to their actual situation>",
  "scores": {
    "project_quality":     {"score": <0-100>, "verdict": "<specific — name actual projects>"},
    "description_clarity": {"score": <0-100>, "verdict": "<specific — reference actual content>"},
    "tech_stack_depth":    {"score": <0-100>, "verdict": "<specific — name their actual stack>"},
    "github_health":       {"score": <0-100>, "verdict": "<specific — address github situation>"},
    "presentation":        {"score": <0-100>, "verdict": "<specific — live demos, design quality>"},
    "recruiter_appeal":    {"score": <0-100>, "verdict": "<specific — internships, companies, overall package>"}
  },
  "roast_paragraphs": [
    "<overview in ${mode} voice — NAME actual companies and projects — calibrated to experience>",
    "<genuine wins — be SPECIFIC about what actually impressed you>",
    "<single biggest improvement area — specific and actionable>",
    "<top 3 numbered actions — specific to their actual situation>"
  ],
  "instant_wins": [
    "<specific fix #1 doable under 1 hour>",
    "<specific fix #2 doable under 1 hour>",
    "<specific fix #3 doable under 1 hour>"
  ],
  "skills_detected": ${JSON.stringify(techStackMentions?.length ? techStackMentions : ["Check portfolio text"])},
  "missing_skills_for_market": ["<skill that would elevate their profile>"],
  "portfolio_archetype": "<MUST BE ONE OF: The Tutorial Collector, The Ghost Dev, The Overclaimer, The Hidden Gem, The Almost There, The Real Deal, The Blank Slate>",
  "share_quote": "<tweet-ready sentence AS RoastFolio about this specific dev>"
}`;
}

function sanitizeResult(result) {
  if (result.overall_grade) {
    result.overall_grade = result.overall_grade.replace(/[^SABCDF]/g, "");
    if (!["S","A","B","C","D","F"].includes(result.overall_grade)) {
      result.overall_grade = "C";
    }
  }
  const validArchetypes = [
    "The Tutorial Collector","The Ghost Dev","The Overclaimer",
    "The Hidden Gem","The Almost There","The Real Deal","The Blank Slate",
  ];
  if (!validArchetypes.includes(result.portfolio_archetype)) {
    result.portfolio_archetype = "The Almost There";
  }
  if (!Array.isArray(result.roast_paragraphs)) {
    result.roast_paragraphs = [String(result.roast_paragraphs || ""), "", "", ""];
  }
  while (result.roast_paragraphs.length < 4) result.roast_paragraphs.push("");
  if (!Array.isArray(result.instant_wins)) {
    result.instant_wins = [String(result.instant_wins || ""), "", ""];
  }
  while (result.instant_wins.length < 3) result.instant_wins.push("Update your README");
  return result;
}

export async function generateRoast(portfolioData) {
  const { mode = "honest" } = portfolioData;

  const temperature = {
    unhinged: 1.2,
    brutal:   0.9,
    honest:   0.7,
    soft:     0.6,
  }[mode] || 0.7;

  const completion = await client.chat.completions.create({
    model:       "qwen/qwen3-32b",
    temperature,
    max_tokens:  2500,
    messages: [
      { role: "system", content: SYSTEM_MESSAGES[mode] || SYSTEM_MESSAGES.honest },
      { role: "user",   content: buildPrompt(portfolioData) },
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
  result.mode          = mode;
  result.portfolio_url = portfolioData.url;
  result.generated_at  = new Date().toISOString();
  result.model_used    = "qwen/qwen3-32b";

  return result;
}