// Extracts text from a PDF buffer using pdf-parse
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractPdfText(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text?.replace(/\s+/g, " ").trim() || "";
  } catch (err) {
    console.warn("PDF parse failed:", err.message);
    return "";
  }
}
