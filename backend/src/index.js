// ============================================================
//  RoastFolio — Express Server Entry Point
// ============================================================
import "dotenv/config";
import express from "express";
import cors from "cors";
import { roastRouter }  from "./routes/roast.js";
import { resumeRouter } from "./routes/resume.js";
import { jobsRouter }   from "./routes/jobs.js";
import { userRouter }   from "./routes/user.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter }  from "./middleware/rateLimiter.js";

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json({ limit: "10mb" }));
app.use(rateLimiter);

// ── Routes ───────────────────────────────────────────────────
app.use("/api/roast",  roastRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/jobs",   jobsRouter);
app.use("/api/user",   userRouter);

// ── Health check (test this first!) ─────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", product: "RoastFolio", version: "1.0.0" });
});

// ── Error handler (always last) ──────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🔥 RoastFolio backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
