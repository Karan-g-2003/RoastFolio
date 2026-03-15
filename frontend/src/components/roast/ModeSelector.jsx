import { Flame, Skull, Scale, Heart, TerminalSquare } from "lucide-react";

const MODES = [
  {
    id: "unhinged",
    label: "UNHINGED",
    emoji: <Flame className="w-6 h-6" />,
    desc: "Chaotic. Viral. Screenshot-worthy.",
    color: "text-neon-red",
    border: "border-neon-red",
    bg: "hover:bg-neon-red/10",
    shadow: "shadow-[4px_4px_0px_0px_#ff003c]",
  },
  {
    id: "brutal",
    label: "BRUTAL",
    emoji: <Skull className="w-6 h-6" />,
    desc: "Cold senior dev. No mercy.",
    color: "text-cyber-white",
    border: "border-cyber-white",
    bg: "hover:bg-cyber-white/10",
    shadow: "shadow-brutal-white",
  },
  {
    id: "honest",
    label: "HONEST",
    emoji: <Scale className="w-6 h-6" />,
    desc: "Balanced mentor. Actionable.",
    color: "text-neon-blue",
    border: "border-neon-blue",
    bg: "hover:bg-neon-blue/10",
    shadow: "shadow-brutal-blue",
  },
  {
    id: "soft",
    label: "SOFT",
    emoji: <Heart className="w-6 h-6" />,
    desc: "Warm & encouraging.",
    color: "text-neon-green",
    border: "border-neon-green",
    bg: "hover:bg-neon-green/10",
    shadow: "shadow-brutal-green",
  },
];

export default function ModeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {MODES.map((mode) => {
        const isActive = selected === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id)}
            className={`
              relative flex flex-col items-start gap-2 p-4 
              border-2 transition-all duration-100 cursor-pointer overflow-hidden
              font-mono text-left
              ${isActive
                ? `${mode.border} ${mode.bg} bg-opacity-20 ${mode.shadow} -translate-y-1`
                : `border-cyber-gray bg-cyber-black hover:border-cyber-white/50 ${mode.bg} opacity-70 hover:opacity-100`
              }
            `}
          >
            {/* Active Terminal Indicator */}
            {isActive && (
              <div className="absolute top-0 right-0 p-2">
                 <TerminalSquare className={`w-4 h-4 ${mode.color} animate-pulse`} />
              </div>
            )}

            {/* Icon */}
            <span className={`${isActive ? mode.color : "text-cyber-gray"}`}>
              {mode.emoji}
            </span>

            {/* Label */}
            <span className={`font-bold tracking-widest mt-2 ${isActive ? mode.color : "text-cyber-white"}`}>
              {mode.label}
            </span>

            {/* Description */}
            <span className={`text-[10px] leading-tight mt-1 uppercase ${isActive ? "text-cyber-white" : "text-cyber-white/50"}`}>
              {mode.desc}
            </span>

            {/* Accent Line */}
            {isActive && (
              <div className={`absolute bottom-0 left-0 h-1 w-full ${mode.bg.replace('hover:bg-', 'bg-').replace('/10', '')}`}></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
