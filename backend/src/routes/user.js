// ============================================================
//  RoastFolio — User Route v2
//  Returns roast history for logged-in user
// ============================================================
import { Router } from "express";
import { getUserRoasts } from "../services/supabaseService.js";
import { requireAuth }   from "../middleware/clerkAuth.js";

export const userRouter = Router();

// ── GET /api/user/history ─────────────────────────────────────
userRouter.get("/history", requireAuth, async (req, res, next) => {
  try {
    const roasts = await getUserRoasts(req.userId);
    res.json({ roasts });
  } catch (err) {
    next(err);
  }
});