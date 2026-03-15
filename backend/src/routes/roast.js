// POST /api/roast
// Accepts: { url?, resumeText?, mode }
// Returns: full roast JSON from Claude
import { Router }    from "express";
import multer        from "multer";
import { handleRoastRequest } from "../services/roastService.js";
import { optionalAuth } from "../middleware/clerkAuth.js";
import { saveRoast } from "../services/supabaseService.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export const roastRouter = Router();

roastRouter.post("/", optionalAuth, upload.single("resume"), async (req, res, next) => {
  try {
    const { url, mode = "honest" } = req.body;
    const resumeFile = req.file || null;

    // Must have at least one input
    if (!url && !resumeFile) {
      return res.status(400).json({ error: "Provide a portfolio URL, a resume PDF, or both." });
    }

    const result = await handleRoastRequest({ url, resumeFile, mode });
    
    // Save to database if user is authenticated
    if (req.userId) {
      saveRoast(req.userId, result).catch(err => {
        console.error("Background save failure:", err);
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/roast/:id — fetch a saved roast by ID (Week 3)
roastRouter.get("/:id", async (req, res, next) => {
  try {
    res.json({ message: `Roast ${req.params.id} — coming in Week 3` });
  } catch (err) {
    next(err);
  }
});
