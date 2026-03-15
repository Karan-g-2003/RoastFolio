const ARCHETYPES = {
  "The Tutorial Collector": { emoji: "📚", desc: "ALL COURSES, NO CREATIONS. KNOWLEDGE WITHOUT EXECUTION.", color: "text-[#fcee0a]", border: "border-[#fcee0a]", shadow: "shadow-[4px_4px_0px_0px_#fcee0a]" },
  "The Ghost Dev":          { emoji: "👻", desc: "GITHUB ACTIVITY SECURELY HIDDEN (OR NON-EXISTENT). TIME TO SHIP.", color: "text-cyber-gray", border: "border-cyber-gray", shadow: "shadow-brutal-white" },
  "The Overclaimer":        { emoji: "🎭", desc: "RESUME: S-TIER. PORTFOLIO: C-TIER. DISCREPANCY DETECTED.", color: "text-neon-red", border: "border-neon-red", shadow: "shadow-brutal-red" },
  "The Hidden Gem":         { emoji: "💎", desc: "HIGH-VALUE ASSETS BURIED UNDER POOR UI. EASY UPGRADES AVAILABLE.", color: "text-neon-blue", border: "border-neon-blue", shadow: "shadow-brutal-blue" },
  "The Almost There":       { emoji: "🚀", desc: "ONE OR TWO UPGRADES FROM BREAKTHROUGH. INITIATE FINAL POLISH.", color: "text-[#ff8c00]", border: "border-[#ff8c00]", shadow: "shadow-[4px_4px_0px_0px_#ff8c00]" },
  "The Real Deal":          { emoji: "👑", desc: "THREAT LEVEL MAXIMUM. REAL SKILLS. CLEAR COMMUNICATION.", color: "text-neon-green", border: "border-neon-green", shadow: "shadow-brutal-green" },
  "The Blank Slate":        { emoji: "📝", desc: "INITIALIZING. EVERYONE STARTS AT ZERO. COMMENCE BUILDING.", color: "text-cyber-white", border: "border-cyber-white", shadow: "shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]" },
};

export default function ArchetypeCard({ archetype }) {
  const data = ARCHETYPES[archetype] || { emoji: "❓", desc: "UNKNOWN ENTITY DETECTED", color: "text-cyber-white", border: "border-cyber-white", shadow: "shadow-brutal-white" };

  return (
    <div className={`bg-cyber-black p-6 border-4 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${data.border} ${data.shadow}`}>
      
      {/* Background glitch line */}
      <div className={`absolute top-0 right-0 w-32 h-full opacity-5 bg-[linear-gradient(90deg,transparent_50%,currentColor_50%)] bg-[length:4px_100%] ${data.color} pointer-events-none`}></div>
      <div className={`absolute top-0 bottom-0 left-0 w-2 ${data.bg ? data.bg.replace('hover:bg-', 'bg-').replace('/10', '') : 'bg-cyber-white/20'}`}></div>

      <div className={`text-6xl p-4 border-2 bg-cyber-black ${data.border}`}>
        {data.emoji}
      </div>
      
      <div className="flex-1 font-mono z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-[10px] font-black tracking-widest uppercase bg-cyber-black border-2 ${data.border} ${data.color}`}>
            SUBJECT_PROFILE
          </span>
          <div className={`h-px flex-1 ${data.bg ? data.bg.replace('hover:bg-', 'bg-').replace('/10', '') : 'bg-cyber-white/30'}`}></div>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-2 ${data.color}`}>
          {archetype}
        </h3>
        <p className="text-xs sm:text-sm text-cyber-white/80 leading-relaxed uppercase border-l-2 border-cyber-white/20 pl-4 py-1">
          {data.desc}
        </p>
      </div>

      <div className={`absolute bottom-2 right-4 text-[10px] font-bold tracking-widest opacity-50 ${data.color}`}>
        [END_OF_FILE]
      </div>
    </div>
  );
}
