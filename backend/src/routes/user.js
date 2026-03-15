// GET /api/user/history
// Returns all roasts for the logged-in user
import { Router } from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import { getUserHistory } from "../services/supabaseService.js";

export const userRouter = Router();

userRouter.get("/history", requireAuth, async (req, res, next) => {
  try {
    const history = await getUserHistory(req.userId);
    res.json({ roasts: history });
  } catch (err) {
    next(err);
  }
});
