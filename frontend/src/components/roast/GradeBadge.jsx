const GRADE_COLORS = {
  S: { bg: "bg-neon-blue", text: "text-neon-blue", border: "border-neon-blue", shadow: "shadow-brutal-blue" },
  A: { bg: "bg-neon-green", text: "text-neon-green", border: "border-neon-green", shadow: "shadow-brutal-green" },
  B: { bg: "bg-[#fcee0a]", text: "text-[#fcee0a]", border: "border-[#fcee0a]", shadow: "shadow-[4px_4px_0px_0px_#fcee0a]" },
  C: { bg: "bg-[#ff8c00]", text: "text-[#ff8c00]", border: "border-[#ff8c00]", shadow: "shadow-[4px_4px_0px_0px_#ff8c00]" },
  D: { bg: "bg-neon-red", text: "text-neon-red", border: "border-neon-red", shadow: "shadow-brutal-red" },
  F: { bg: "bg-[#8b0000]", text: "text-[#8b0000]", border: "border-[#8b0000]", shadow: "shadow-[4px_4px_0px_0px_#8b0000]" },
};

export default function GradeBadge({ grade, score }) {
  const color = GRADE_COLORS[grade] || GRADE_COLORS.F;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main badge */}
      <div
        className={`
          relative w-32 h-32 sm:w-48 sm:h-48 
          flex flex-col items-center justify-center
          bg-cyber-black border-4 ${color.border} ${color.shadow}
          animate-pulse mix-blend-screen
        `}
      >
        <span className="absolute top-2 left-2 text-[10px] font-mono text-cyber-white/50 tracking-widest">
          CLASS:
        </span>
        <span
          className={`font-black uppercase text-7xl sm:text-9xl tracking-tighter ${color.text}`}
          style={{ textShadow: `0 0 20px currentColor` }}
        >
          {grade}
        </span>
        <div className={`absolute bottom-2 right-2 w-3 h-3 ${color.bg}`}></div>
      </div>

      {/* Score underneath */}
      <div className="text-center font-mono bg-cyber-black border-2 border-cyber-white px-6 py-2 shadow-brutal-white inline-block">
        <span className="text-xs text-cyber-white/60 mr-2 tracking-widest">OVERALL_RATING:</span>
        <span className="text-2xl font-bold text-cyber-white">{score}</span>
        <span className="text-cyber-white/40 text-sm">/100</span>
      </div>
    </div>
  );
}
