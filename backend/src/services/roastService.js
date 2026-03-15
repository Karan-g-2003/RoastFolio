// ============================================================
//  RoastFolio — Roast Service (fixed orchestrator)
//  Properly passes resumeText to scraper for GitHub detection
// ============================================================
import { scrapePortfolio, extractFromResumeOnly } from "./scraperService.js";
import { extractPdfText  } from "./pdfService.js";
import { generateRoast   } from "./roastEngine.js";

export async function handleRoastRequest({ url, resumeFile, mode }) {
  let portfolioData = { mode };
  let resumeText    = "";

  // ── 1. Extract resume text first (needed for scraper too) ──
  if (resumeFile) {
    resumeText = await extractPdfText(resumeFile.buffer);
    portfolioData.resumeText = resumeText;
  }

  // ── 2. Scrape portfolio URL if given ──
  if (url) {
    // Pass resumeText so GitHub in PDF gets detected even on URL path
    const scraped = await scrapePortfolio(url, resumeText);
    portfolioData = { ...portfolioData, ...scraped };
  } else if (resumeText) {
    // No URL — extract everything from resume only
    const fromResume = extractFromResumeOnly(resumeText);
    portfolioData = { ...portfolioData, ...fromResume };
  }

  // ── 3. Send to AI ──
  const roastResult = await generateRoast(portfolioData);
  return roastResult;
}