import { Link }  from "react-router-dom";
import { Flame, FileText, Briefcase, ArrowRight, Zap, Shield, Terminal } from "lucide-react";
import Starfield from "../components/Starfield";

const FEATURES = [
  {
    icon: <Flame className="w-8 h-8" />,
    title: "ROAST_PROTOCOL",
    desc: "AI systematically dismantles your portfolio and codebase with brutal, honest feedback. Get a raw score.",
    color: "text-neon-red",
    border: "border-neon-red",
    shadow: "shadow-brutal-red",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "BUILD_EXECUTE",
    desc: "AI rebuilds your resume in LaTeX, injected directly to target specific job parameters. ATS-optimised.",
    color: "text-neon-blue",
    border: "border-neon-blue",
    shadow: "shadow-brutal-blue",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "MATCH_MATRIX",
    desc: "AI scans the remote grid for roles matching your exact spec and ranks them by probability of extraction.",
    color: "text-neon-green",
    border: "border-neon-green",
    shadow: "shadow-brutal-green",
  },
];

const GRADES = [
  { letter: "S", label: "ELITE", color: "text-neon-blue", border: "border-neon-blue", shadow: "shadow-brutal-blue" },
  { letter: "A", label: "STRONG", color: "text-neon-green", border: "border-neon-green", shadow: "shadow-brutal-green" },
  { letter: "B", label: "DECENT", color: "text-neon-yellow", border: "border-neon-yellow", shadow: "shadow-brutal-yellow" },
  { letter: "C", label: "FLAWED", color: "text-[#ff8c00]", border: "border-[#ff8c00]", shadow: "shadow-[4px_4px_0px_0px_#ff8c00]" },
  { letter: "D", label: "WEAK", color: "text-neon-red", border: "border-neon-red", shadow: "shadow-brutal-red" },
  { letter: "F", label: "FATAL", color: "text-[#8b0000]", border: "border-[#8b0000]", shadow: "shadow-[4px_4px_0px_0px_#8b0000]" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-transparent overflow-hidden font-sans">
      <Starfield />
      
      {/* ═══════ HERO ═══════ */}
      <section className="relative px-4 pt-24 pb-24 sm:pt-32 sm:pb-32 border-b-2 border-cyber-white/20">
        <div className="relative max-w-5xl mx-auto text-center space-y-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-neon-green bg-cyber-black text-neon-green text-xs font-mono font-bold tracking-widest uppercase shadow-[4px_4px_0px_0px_#00ff41]">
            <Terminal className="w-4 h-4" />
            System_v2.0_Online
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-none">
            <span className="text-cyber-white">KNOW YOUR</span>
            <br />
            <span className="text-neon-red animate-pulse">TRUE VALUE</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl font-mono text-cyber-white/80 max-w-3xl mx-auto leading-relaxed border-l-4 border-neon-yellow pl-6 text-left">
            &gt; INITIALIZING... <br/>
            &gt; AI SCANS YOUR PORTFOLIO.<br/>
            &gt; EVALUATES CODEBASE.<br/>
            &gt; EXTRACTS WEAKNESSES.<br/>
            <span className="text-neon-green font-bold">&gt; NO SUGARCOATING ALLOWED.</span>
          </p>

          {/* CTA Buttons */}
          <div className="pt-8">
            <Link
              to="/roast"
              className="cyber-button text-xl px-10 py-5 group glitch-hover inline-flex items-center gap-4"
            >
              <Zap className="w-6 h-6 group-hover:animate-ping" />
              INITIATE_SCAN <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ STATS TICKER ═══════ */}
      <div className="border-t-2 border-b-2 border-neon-green bg-cyber-black/90 py-3 overflow-hidden whitespace-nowrap relative z-10 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
        <div className="inline-block animate-[marquee_30s_linear_infinite] font-mono text-neon-green font-bold text-sm tracking-widest uppercase">
          <span className="mx-4 sm:mx-8">[ DEVS_ROASTED: 1,247 ]</span>———
          <span className="mx-4 sm:mx-8">[ AVG_SCORE: 61/100 ]</span>———
          <span className="mx-4 sm:mx-8">[ MOST_COMMON_ARCHETYPE: THE_TUTORIAL_COLLECTOR ]</span>———
          <span className="mx-4 sm:mx-8">[ ROASTS_TODAY: 43 ]</span>———
          <span className="mx-4 sm:mx-8">[ TOP_WEAKNESS: GITHUB_HEALTH ]</span>———
          {/* Duplicate for seamless loop */}
          <span className="mx-4 sm:mx-8">[ DEVS_ROASTED: 1,247 ]</span>———
          <span className="mx-4 sm:mx-8">[ AVG_SCORE: 61/100 ]</span>———
          <span className="mx-4 sm:mx-8">[ MOST_COMMON_ARCHETYPE: THE_TUTORIAL_COLLECTOR ]</span>———
          <span className="mx-4 sm:mx-8">[ ROASTS_TODAY: 43 ]</span>———
          <span className="mx-4 sm:mx-8">[ TOP_WEAKNESS: GITHUB_HEALTH ]</span>———
        </div>
      </div>

      {/* ═══════ FEATURES ═══════ */}
      <section className="relative px-4 py-24 sm:py-32 border-b-2 border-cyber-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-2 flex-grow bg-cyber-white"></div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-cyber-white whitespace-nowrap">
              SYSTEM_CAPABILITIES
            </h2>
            <div className="h-2 w-16 bg-neon-red"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`cyber-card bg-cyber-black transition-transform duration-200 hover:-translate-y-2 group ${f.border} ${f.shadow}`}
              >
                <div className={`mb-6 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className={`text-2xl font-black uppercase tracking-wider mb-4 border-b-2 pb-2 ${f.border} ${f.color}`}>
                  {f.title}
                </h3>
                <p className="text-cyber-white/80 font-mono text-sm leading-relaxed">
                  {f.desc}
                </p>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-none bg-cyber-white animate-ping"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GRADE SYSTEM PREVIEW ═══════ */}
      <section className="px-4 py-24 sm:py-32 border-b-2 border-cyber-white/20 bg-[linear-gradient(45deg,#050505_25%,#1a1a1a_25%,#1a1a1a_50%,#050505_50%,#050505_75%,#1a1a1a_75%,#1a1a1a_100%)] bg-[length:20px_20px]">
        <div className="max-w-5xl mx-auto bg-cyber-black border-4 border-cyber-white p-8 sm:p-16 shadow-brutal-white">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-cyber-white bg-cyber-black inline-block px-4">
              THREAT_LEVEL_ASSESSMENT
            </h2>
            <p className="font-mono text-neon-yellow">
              // FROM 'GHOST DEV' [F] TO 'THE REAL DEAL' [S]
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 stagger-children">
            {GRADES.map((g) => (
              <div key={g.letter} className="flex flex-col items-center gap-4">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center
                             border-4 font-black text-4xl sm:text-5xl bg-cyber-black
                             transition-all duration-100 mix-blend-screen
                             ${g.color} ${g.border} ${g.shadow}`}
                >
                  {g.letter}
                </div>
                <span className={`text-sm font-mono font-bold tracking-widest px-2 py-1 border-2 bg-cyber-black ${g.color} ${g.border}`}>
                  [{g.label}]
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS (EXECUTION SEQUENCE) ═══════ */}
      <section className="relative px-4 py-24 sm:py-32 border-b-2 border-cyber-white/20 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%,transparent_100%)] bg-[length:20px_20px]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-cyber-white whitespace-nowrap bg-cyber-black px-2 glitch-text">
              &gt; EXECUTION_SEQUENCE
            </h2>
            <div className="hidden sm:block h-2 flex-grow bg-cyber-white"></div>
          </div>

          <div className="relative flex flex-col md:flex-row gap-8 md:gap-4 justify-between">
            {/* Connecting dashed line (desktop only) */}
            <div className="hidden md:block absolute top-[20%] left-0 w-full border-t-2 border-dashed border-cyber-white/30 -z-10"></div>
            
            {/* Step 1 */}
            <div className="flex-1 bg-cyber-black border-2 border-neon-blue p-8 shadow-[4px_4px_0px_0px_#00f0ff] relative group">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-cyber-black border-2 border-neon-blue text-neon-blue flex items-center justify-center font-bold text-xl">
                01
              </div>
              <h3 className="text-2xl font-black uppercase tracking-wider mb-4 text-cyber-white mt-2">
                UPLOAD_ASSETS
              </h3>
              <p className="text-cyber-white/80 font-mono text-sm leading-relaxed">
                Upload your portfolio URL and/or resume PDF. Both inputs = deeper analysis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 bg-cyber-black border-2 border-neon-red p-8 shadow-[4px_4px_0px_0px_#ff003c] relative group md:mt-12">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-cyber-black border-2 border-neon-red text-neon-red flex items-center justify-center font-bold text-xl">
                02
              </div>
              <h3 className="text-2xl font-black uppercase tracking-wider mb-4 text-cyber-white mt-2">
                RUN_ANALYSIS
              </h3>
              <p className="text-cyber-white/80 font-mono text-sm leading-relaxed">
                AI cross-references 6 threat dimensions. No mercy. No fluff. Just raw data.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-cyber-black border-2 border-neon-green p-8 shadow-[4px_4px_0px_0px_#00ff41] relative group md:mt-24">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-cyber-black border-2 border-neon-green text-neon-green flex items-center justify-center font-bold text-xl">
                03
              </div>
              <h3 className="text-2xl font-black uppercase tracking-wider mb-4 text-cyber-white mt-2">
                EXTRACT_RESULTS
              </h3>
              <p className="text-cyber-white/80 font-mono text-sm leading-relaxed">
                Download your grade, roast, action plan, and job matches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF / ROASTS ═══════ */}
      <section className="relative px-4 py-24 sm:py-32 border-b-2 border-cyber-white/20">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-cyber-white bg-cyber-black inline-block px-4 glitch-text">
              &gt; INTERCEPTED_TRANSMISSIONS
            </h2>
            <p className="font-mono text-neon-yellow">
              // real roasts. identities redacted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-cyber-black border-2 border-[#ff8c00] p-6 shadow-[4px_4px_0px_0px_#ff8c00] hover:-translate-y-2 transition-transform duration-200 glitch-hover group cursor-crosshair">
              <div className="flex justify-between items-start mb-6 border-b-2 border-[#ff8c00] pb-4 group-hover:border-cyber-black">
                <div>
                  <div className="text-xs font-mono text-cyber-white/60 mb-1 group-hover:text-cyber-black/70">GRADE</div>
                  <div className="text-3xl font-black text-[#ff8c00] group-hover:text-cyber-black">CLASS: C | 58/100</div>
                </div>
              </div>
              <p className="font-mono text-sm mb-6 leading-relaxed text-cyber-white group-hover:text-cyber-black">
                "FOUR TODO APPS AND A WEATHER WIDGET DO NOT A PORTFOLIO MAKE."
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="text-neon-green group-hover:text-cyber-black font-bold h-6 flex items-center">&gt; Skills: React, JavaScript, HTML/CSS</div>
                <div className="text-neon-red group-hover:text-cyber-black font-bold h-6 flex items-center">&gt; Missing: TypeScript, backend exp</div>
              </div>
              <div className="mt-6 pt-4 border-t border-cyber-white/20 text-xs font-mono flex justify-between items-center group-hover:border-cyber-black/20">
                <span className="text-cyber-white/60 group-hover:text-cyber-black/60">ARCHETYPE:</span>
                <span className="font-bold text-cyber-white group-hover:text-cyber-black">THE_TUTORIAL_COLLECTOR</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-cyber-black border-2 border-neon-green p-6 shadow-[4px_4px_0px_0px_#00ff41] hover:-translate-y-2 transition-transform duration-200 glitch-hover group cursor-crosshair">
              <div className="flex justify-between items-start mb-6 border-b-2 border-neon-green pb-4 group-hover:border-cyber-black">
                <div>
                  <div className="text-xs font-mono text-cyber-white/60 mb-1 group-hover:text-cyber-black/70">GRADE</div>
                  <div className="text-3xl font-black text-neon-green group-hover:text-cyber-black">CLASS: A | 84/100</div>
                </div>
              </div>
              <p className="font-mono text-sm mb-6 leading-relaxed text-cyber-white group-hover:text-cyber-black">
                "IMPRESSIVE DEPTH, CATASTROPHIC PRESENTATION. FIX THE README."
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="text-neon-green group-hover:text-cyber-black font-bold h-6 flex items-center">&gt; Skills: Python, ML, FastAPI, Docker</div>
                <div className="text-neon-red group-hover:text-cyber-black font-bold h-6 flex items-center">&gt; Missing: Portfolio site, live demos</div>
              </div>
              <div className="mt-6 pt-4 border-t border-cyber-white/20 text-xs font-mono flex justify-between items-center group-hover:border-cyber-black/20">
                <span className="text-cyber-white/60 group-hover:text-cyber-black/60">ARCHETYPE:</span>
                <span className="font-bold text-cyber-white group-hover:text-cyber-black">THE_HIDDEN_GEM</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-cyber-black border-2 border-neon-red p-6 shadow-[4px_4px_0px_0px_#ff003c] hover:-translate-y-2 transition-transform duration-200 glitch-hover group cursor-crosshair">
              <div className="flex justify-between items-start mb-6 border-b-2 border-neon-red pb-4 group-hover:border-cyber-black">
                <div>
                  <div className="text-xs font-mono text-cyber-white/60 mb-1 group-hover:text-cyber-black/70">GRADE</div>
                  <div className="text-3xl font-black text-neon-red group-hover:text-cyber-black">CLASS: D | 31/100</div>
                </div>
              </div>
              <p className="font-mono text-sm mb-6 leading-relaxed text-cyber-white group-hover:text-cyber-black">
                "GITHUB: 2 REPOS. LAST COMMIT: 8 MONTHS AGO. YOU ARE A MYTH."
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="text-neon-green group-hover:text-cyber-black font-bold h-6 flex items-center">&gt; Skills: JavaScript</div>
                <div className="text-neon-red group-hover:text-cyber-black font-bold h-6 flex items-center">&gt; Missing: Everything. Literally everything.</div>
              </div>
              <div className="mt-6 pt-4 border-t border-cyber-white/20 text-xs font-mono flex justify-between items-center group-hover:border-cyber-black/20">
                <span className="text-cyber-white/60 group-hover:text-cyber-black/60">ARCHETYPE:</span>
                <span className="font-bold text-cyber-white group-hover:text-cyber-black">THE_GHOST_DEV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BOTTOM CTA ═══════ */}
      <section className="px-4 py-24 sm:py-32 text-center relative">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-5xl sm:text-7xl font-black text-cyber-white uppercase">
            COMMENCE<br/>EVALUATION?
          </h2>
          <p className="font-mono text-neon-blue text-lg">
            WARNING: BRUTAL HONESTY PROTOCOL ACTIVE.
          </p>
          <div className="pt-6">
            <Link
              to="/roast"
              className="cyber-button text-2xl px-12 py-6 group glitch-hover inline-flex items-center gap-3 border-neon-green shadow-brutal-green text-neon-green"
            >
              <Terminal className="w-8 h-8" />
              RUN_ROAST.exe
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t-4 border-cyber-white px-6 py-8 bg-cyber-gray relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-sm text-cyber-white/80">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-neon-green border border-cyber-black animate-pulse"></div>
            <span className="font-bold text-cyber-white uppercase tracking-widest">RoastFolio_OS</span>
            <span className="text-xs text-cyber-white/60">// v2.0.4</span>
          </div>
          
          <div className="flex items-center gap-6 font-bold">
            <span className="text-neon-yellow">BUILT_BY: KARAN</span>
            <a href="https://github.com/Karan-g-2003" target="_blank" rel="noreferrer" className="hover:text-neon-green transition-colors hover:cursor-pointer flex items-center gap-2">
              [ GITHUB ]
            </a>
            <a href="https://www.linkedin.com/in/karanghuwalewala" target="_blank" rel="noreferrer" className="hover:text-neon-blue transition-colors hover:cursor-pointer flex items-center gap-2">
              [ LINKEDIN ]
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-cyber-white/40">
            <Shield className="w-4 h-4 text-neon-yellow" />
            <span>SESSION_DATA_VOLATILE // NO_LOGS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}