// ============================================================
//  RoastFolio — Vercel Serverless Entry Point
//  This file wraps the Express app for Vercel deployment.
//  Place this at: backend/api/index.js
// ============================================================
import "dotenv/config";
import express    from "express";
import cors       from "cors";
import { roastRouter }  from "../src/routes/roast.js";
import { resumeRouter } from "../src/routes/resume.js";
import { jobsRouter }   from "../src/routes/jobs.js";
import { userRouter }   from "../src/routes/user.js";
import { errorHandler } from "../src/middleware/errorHandler.js";
import { rateLimiter }  from "../src/middleware/rateLimiter.js";

const app = express();

// Allow requests from your Vercel frontend URL
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
];

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "https://roast-folio.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(rateLimiter);

// Routes
app.use("/api/roast",  roastRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/jobs",   jobsRouter);
app.use("/api/user",   userRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", product: "RoastFolio", version: "1.0.0" });
});

app.use(errorHandler);

// Vercel needs the app exported — NOT app.listen()
export default app;