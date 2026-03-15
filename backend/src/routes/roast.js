// ============================================================
//  RoastFolio — Roast Route v2
//  Always saves roast, returns DB id for dashboard
// ============================================================
import { Router } from "express";
import multer     from "multer";
import { handleRoastRequest } from "../services/roastService.js";
import { saveRoast, getRoastById, makeRoastPublic } from "../services/supabaseService.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
});

export const roastRouter = Router();

// ── POST /api/roast ───────────────────────────────────────────
roastRouter.post("/", upload.single("resume"), async (req, res, next) => {
  try {
    const { url, mode = "honest" } = req.body;
    const resumeFile = req.file || null;
    const userId     = req.userId || null; // set by optionalAuth middleware

    if (!url && !resumeFile) {
      return res.status(400).json({
        error: "Please provide a portfolio URL, a resume PDF, or both.",
      });
    }

    // 1. Generate roast
    const roastResult = await handleRoastRequest({ url, resumeFile, mode });

    // 2. Save to Supabase (never crash if this fails)
    let savedId = null;
    try {
      const saved = await saveRoast({ userId, roastResult });
      savedId = saved?.id || null;
    } catch (saveErr) {
      console.error("[Route] Supabase save error:", saveErr.message);
    }

    // 3. Return result with ID
    res.json({ ...roastResult, id: savedId });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/roast/:id ────────────────────────────────────────
roastRouter.get("/:id", async (req, res, next) => {
  try {
    const roast = await getRoastById(req.params.id);
    res.json(roast.full_result
      ? { ...roast.full_result, id: roast.id }
      : roast
    );
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/roast/:id/share ────────────────────────────────
roastRouter.patch("/:id/share", async (req, res, next) => {
  try {
    const roast = await makeRoastPublic(req.params.id);
    res.json({ success: true, id: roast.id });
  } catch (err) {
    next(err);
  }
});