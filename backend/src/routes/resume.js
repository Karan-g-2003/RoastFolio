// POST /api/resume/generate
// Accepts: { roastId, jobDescription }
// Returns: { latex: string, downloadUrl: string }
import { Router } from "express";

export const resumeRouter = Router();

resumeRouter.post("/generate", async (req, res, next) => {
  try {
    // Week 4 feature — placeholder so the route exists and doesn't 404
    const { roastId, jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ error: "Job description required." });
    res.json({ message: "LaTeX resume builder coming in Week 4!", roastId, jobDescription: jobDescription.slice(0, 50) });
  } catch (err) {
    next(err);
  }
});
