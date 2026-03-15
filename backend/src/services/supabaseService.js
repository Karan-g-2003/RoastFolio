import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export async function saveRoast(userId, roastData) {
  if (!supabase || !userId) return null;
  
  const { portfolio_url, mode, overall_score, overall_grade, portfolio_archetype } = roastData;
  
  const record = {
    user_id: userId,
    portfolio_url: portfolio_url || null,
    mode: mode,
    overall_score: overall_score,
    overall_grade: overall_grade,
    archetype: portfolio_archetype || roastData.archetype,
    full_result: roastData,
    is_public: false
  };

  const { data, error } = await supabase
    .from('roasts')
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error saving roast:", error);
  }
  return data;
}

export async function getUserHistory(userId) {
  if (!supabase || !userId) return [];
  
  const { data, error } = await supabase
    .from('roasts')
    .select('id, created_at, overall_grade, overall_score, archetype, mode')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Error fetching history:", error);
    throw error;
  }
  return data;
}
