import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

// Optional auth — attaches userId if token present, doesn't block if not
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();
    const token = authHeader.split(" ")[1];
    const payload = await clerk.verifyToken(token);
    req.userId = payload.sub;
  } catch {
    // Token invalid — continue without auth (free tier still works)
  }
  next();
}

// Required auth — blocks with 401 if no valid token
export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Authentication required." });
    const payload = await clerk.verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}
