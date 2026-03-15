const LABELS = {
  project_quality:     "PROJECT_QUALITY",
  description_clarity: "DESCRIPTION_CLARITY",
  tech_stack_depth:    "TECH_STACK_DEPTH",
  github_health:       "GITHUB_HEALTH",
  presentation:        "PRESENTATION",
  recruiter_appeal:    "RECRUITER_APPEAL",
};

function getBarColor(score) {
  if (score >= 80) return "bg-neon-green shadow-[0_0_15px_rgba(0,255,65,0.8)]";
  if (score >= 60) return "bg-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.8)]";
  if (score >= 40) return "bg-[#fcee0a] shadow-[0_0_15px_rgba(252,238,10,0.8)]";
  if (score >= 20) return "bg-[#ff8c00] shadow-[0_0_15px_rgba(255,140,0,0.8)]";
  return "bg-neon-red shadow-[0_0_15px_rgba(255,0,60,0.8)]";
}

export default function ScoreBar({ dimension, score, verdict, delay = 0 }) {
  return (
    <div
      className="space-y-2 animate-fade-in-right font-mono"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Label + score */}
      <div className="flex items-center justify-between border-b-2 border-cyber-white/20 pb-1">
        <span className="text-sm font-bold tracking-widest text-cyber-white">
          {LABELS[dimension] || dimension}
        </span>
        <span className="text-sm font-bold text-neon-yellow">[{score}/100]</span>
      </div>

      {/* Bar track - Fighting Game Style */}
      <div className="h-4 bg-cyber-black border-2 border-cyber-white p-0.5 relative overflow-hidden">
        {/* Grid lines to make it look segmented */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,#050505_90%)] bg-[length:10%_100%] z-10 pointer-events-none"></div>
        
        <div
          className={`h-full animate-score-fill ${getBarColor(score)} transition-all duration-1000 ease-out`}
          style={{ "--score-width": `${score}%`, animationDelay: `${delay + 0.3}s`, width: "0%" }}
        />
      </div>

      {/* Verdict text */}
      {verdict && (
        <p className="text-xs text-cyber-white/70 leading-relaxed uppercase pl-2 border-l-2 border-cyber-white/30">
          <span className="text-neon-blue font-bold mr-1">&gt; ANALYSIS:</span>
          {verdict}
        </p>
      )}
    </div>
  );
}
