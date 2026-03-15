// POST /api/jobs/match
// Accepts: { roastId, skills }
// Returns: { matched: Array }
import { Router } from "express";

export const jobsRouter = Router();

jobsRouter.post("/match", async (req, res, next) => {
  try {
    // Week 5 feature — placeholder
    res.json({ message: "Job matching coming in Week 5!", skills: req.body.skills });
  } catch (err) {
    next(err);
  }
});
