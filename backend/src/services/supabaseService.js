// ============================================================
//  RoastFolio — Supabase Service v2
//  Fixed for Vercel serverless — client initialized per request
// ============================================================
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.error("[Supabase] Missing env vars — SUPABASE_URL or SUPABASE_SERVICE_KEY");
    return null;
  }
  return createClient(url, key);
}

// ── Save a roast ──────────────────────────────────────────────
export async function saveRoast({ userId, roastResult }) {
  const supabase = getClient();
  if (!supabase) {
    console.warn("[Supabase] Skipping save — client not initialized");
    return { id: null };
  }

  try {
    const { data, error } = await supabase
      .from("roasts")
      .insert({
        user_id:       userId || null,
        portfolio_url: roastResult.portfolio_url || null,
        mode:          roastResult.mode          || "honest",
        overall_score: roastResult.overall_score || 0,
        overall_grade: roastResult.overall_grade || "C",
        archetype:     roastResult.portfolio_archetype || null,
        full_result:   roastResult,
        is_public:     false,
      })
      .select()
      .single();

    if (error) {
      console.error("[Supabase] Insert error:", error.message);
      return { id: null };
    }
    console.log("[Supabase] Roast saved:", data.id);
    return data;
  } catch (err) {
    console.error("[Supabase] Save failed:", err.message);
    return { id: null };
  }
}

// ── Get roast by ID ───────────────────────────────────────────
export async function getRoastById(id) {
  const supabase = getClient();
  if (!supabase) throw new Error("Database unavailable");

  const { data, error } = await supabase
    .from("roasts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Roast not found: " + error.message);
  return data;
}

// ── Get all roasts for a user ─────────────────────────────────
export async function getUserRoasts(userId) {
  const supabase = getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("roasts")
    .select("id, overall_score, overall_grade, archetype, mode, portfolio_url, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Supabase] Fetch history error:", error.message);
    return [];
  }
  return data || [];
}

// ── Make roast public ─────────────────────────────────────────
export async function makeRoastPublic(id) {
  const supabase = getClient();
  if (!supabase) throw new Error("Database unavailable");

  const { data, error } = await supabase
    .from("roasts")
    .update({ is_public: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Failed to make public: " + error.message);
  return data;
}
