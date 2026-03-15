import rateLimit from "express-rate-limit";

// Free users get 3 roasts per hour per IP.
// Paid users bypass this via auth middleware (coming in Week 3).
export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,                   // 30 requests per hour (generous for dev)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a bit and try again." },
});
