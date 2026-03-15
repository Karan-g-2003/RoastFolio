// Central API client — all backend calls go through here
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

// ── Roast a portfolio/resume ──────────────────────────────────
export async function submitRoast({ url, file, mode, token, userId }) {
  const form = new FormData();
  if (url)    form.append("url", url);
  if (file)   form.append("resume", file);
  if (userId) form.append("userId", userId);
  form.append("mode", mode);

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const { data } = await api.post("/api/roast", form, { headers });
  return data;
}

// ── Generate LaTeX resume for a job ──────────────────────────
export async function generateResume({ roastId, jobDescription }) {
  const { data } = await api.post("/api/resume/generate", { roastId, jobDescription });
  return data;
}

// ── Get job matches ───────────────────────────────────────────
export async function getJobMatches({ skills }) {
  const { data } = await api.post("/api/jobs/match", { skills });
  return data;
}

// ── Get user history ──────────────────────────────────────────
export async function getUserHistory(token) {
  const { data } = await api.get("/api/user/history", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data.roasts;
}
