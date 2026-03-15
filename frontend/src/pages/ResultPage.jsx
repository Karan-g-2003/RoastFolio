import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Zap, Target, Code2, Sparkles, Terminal } from "lucide-react";
import GradeBadge    from "../components/roast/GradeBadge.jsx";
import ScoreBar      from "../components/roast/ScoreBar.jsx";
import ArchetypeCard from "../components/roast/ArchetypeCard.jsx";
import ShareButton   from "../components/roast/ShareButton.jsx";

const SCORE_ORDER = [
  "project_quality",
  "description_clarity",
  "tech_stack_depth",
  "github_health",
  "presentation",
  "recruiter_appeal",
];

export default function ResultPage() {
  const { state } = useLocation();
  const navigate   = useNavigate();
  const roast      = state?.roast;

  // No data — redirect back to form
  if (!roast) {
    return (
      <main className="min-h-screen bg-cyber-black flex flex-col items-center justify-center gap-6 px-4 font-mono">
        <div className="text-6xl animate-pulse text-neon-red">_ERR</div>
        <h2 className="text-2xl font-black text-cyber-white text-center tracking-widest uppercase">
           DATA_NOT_FOUND
        </h2>
        <p className="text-cyber-white/60 text-center">INITIALIZE A NEW SCAN SEQUENCE TO PROCEED.</p>
        <Link
          to="/roast"
          className="cyber-button mt-4"
        >
          RETURN_TO_TERMINAL
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cyber-black px-4 py-16 sm:py-24 font-sans font-mono selection:bg-neon-green selection:text-cyber-black">
      {/* Grid Background Override for this page to be more subtle */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

      <div className="relative max-w-4xl mx-auto space-y-16 z-10">

        {/* ── Header Toolbar ── */}
        <div className="flex items-center justify-between border-b-2 border-cyber-white/20 pb-4">
          <button
            onClick={() => navigate("/roast")}
            className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-cyber-white/60 hover:text-neon-green transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            ABORT / RESTART
          </button>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-red animate-pulse">
            <span className="w-2 h-2 bg-neon-red"></span>
            EVALUATION_COMPLETE
          </div>
        </div>

        {/* ── Hero: Grade + One-liner ── */}
        <section className="text-center space-y-8 animate-fade-in-up">
          <GradeBadge grade={roast.overall_grade} score={roast.overall_score} />
          
          <div className="relative inline-block max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-neon-green blur opacity-20"></div>
            <div className="relative bg-cyber-black border-2 border-neon-green p-6 shadow-brutal-green">
              <Terminal className="absolute top-2 left-2 w-4 h-4 text-neon-green/50" />
              <p className="text-xl sm:text-2xl font-bold text-cyber-white uppercase tracking-tighter leading-tight italic pt-2">
                "{roast.one_liner}"
              </p>
            </div>
          </div>
          
          {roast.portfolio_url && (
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 border border-cyber-white/20 bg-cyber-black">
              <span className="text-xs text-cyber-white/40 uppercase tracking-widest">TARGET:</span>
              <p className="text-sm text-neon-blue font-bold tracking-wider truncate max-w-[200px] sm:max-w-md">
                {roast.portfolio_url}
              </p>
            </div>
          )}
        </section>

        <hr className="border-cyber-white/10" />

        {/* ── Archetype ── */}
        <section className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <ArchetypeCard archetype={roast.portfolio_archetype} />
        </section>

        {/* ── Score Breakdown ── */}
        <section className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 space-y-4 border-r-2 border-cyber-white/10 pr-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-cyber-white text-cyber-black font-black uppercase tracking-widest text-lg shadow-[4px_4px_0px_0px_#00ff41]">
                <Target className="w-5 h-5" /> SYSTEM_METRICS
              </div>
              <p className="text-xs text-cyber-white/50 leading-relaxed">
                DEEP SCAN ANALYSIS ACROSS 6 CORE DIMENSIONS. THREAT LEVELS IDENTIFIED.
              </p>
            </div>
            
            <div className="md:w-2/3 space-y-6">
              {SCORE_ORDER.map((key, i) => {
                const dim = roast.scores?.[key];
                if (!dim) return null;
                return (
                  <ScoreBar
                    key={key}
                    dimension={key}
                    score={dim.score}
                    verdict={dim.verdict}
                    delay={i * 0.1}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <hr className="border-cyber-white/10" />

        {/* ── Roast Paragraphs (Typewriter Effect) ── */}
        {roast.roast_paragraphs?.length > 0 && (
          <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="inline-flex items-center gap-2 px-2 py-1 border-2 border-neon-red text-neon-red font-black uppercase tracking-widest text-lg">
              <Terminal className="w-5 h-5 animate-pulse" /> RAW_OUTPUT_LOG
            </div>
            
            <div className="space-y-6 border-l-4 border-neon-red pl-6 py-2">
              {roast.roast_paragraphs.map((para, i) => (
                <div
                  key={i}
                  className="text-cyber-white/90 text-sm sm:text-base leading-relaxed font-sans mt-4"
                >
                  <span className="text-neon-red font-bold font-mono mr-2">&gt;</span>
                  {para}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills & Instant Wins (Grid) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          
          {/* Instant Wins */}
          {roast.instant_wins?.length > 0 && (
            <section className="bg-cyber-gray border-2 border-neon-yellow p-6 shadow-brutal-yellow">
              <h2 className="text-lg font-black text-neon-yellow flex items-center gap-2 mb-6 uppercase tracking-widest border-b-2 border-neon-yellow/30 pb-2">
                <Zap className="w-5 h-5 animate-pulse" /> ACTION_REQUIRED
              </h2>
              <ul className="space-y-4">
                {roast.instant_wins.map((win, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-cyber-white/80 font-sans"
                  >
                    <span className="text-cyber-black bg-neon-yellow font-black px-1.5 py-0.5 mt-0.5 text-xs">
                      {i + 1}
                    </span>
                    {win}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          <section className="space-y-8">
            {/* Detected */}
            {roast.skills_detected?.length > 0 && (
              <div className="bg-cyber-black border-2 border-neon-green p-6 shadow-brutal-green">
                <h3 className="text-sm font-black text-neon-green flex items-center gap-2 mb-4 uppercase tracking-widest">
                  <Code2 className="w-4 h-4" /> ASSETS_DETECTED
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roast.skills_detected.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs font-bold uppercase bg-neon-green text-cyber-black"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing */}
            {roast.missing_skills_for_market?.length > 0 && (
              <div className="bg-cyber-black border-2 border-neon-blue p-6 shadow-brutal-blue">
                <h3 className="text-sm font-black text-neon-blue flex items-center gap-2 mb-4 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> UPGRADES_NEEDED
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roast.missing_skills_for_market.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs font-bold uppercase border border-neon-blue text-neon-blue"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ── Share ── */}
        <section className="flex flex-col items-center gap-6 pt-12 pb-6 animate-fade-in-up border-t-2 border-cyber-white/10" style={{ animationDelay: "0.8s" }}>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-cyber-white uppercase tracking-tighter">
              BROADCAST_RESULTS
            </h2>
            <p className="text-xs text-cyber-white/50 font-mono">
              WARNING: EXPOSING THREAT LEVEL MAY COMPROMISE EGO.
            </p>
          </div>
          
          <ShareButton
            shareQuote={roast.share_quote}
            grade={roast.overall_grade}
            score={roast.overall_score}
          />
          
          {roast.share_quote && (
            <div className="relative mt-4">
              <span className="text-4xl text-cyber-white/20 absolute -top-4 -left-6">"</span>
              <p className="text-sm text-cyber-white/70 text-center font-bold uppercase tracking-wider max-w-lg z-10 relative">
                {roast.share_quote}
              </p>
              <span className="text-4xl text-cyber-white/20 absolute -bottom-8 -right-4">"</span>
            </div>
          )}
        </section>

        {/* ── Footer CTA ── */}
        <div className="text-center pb-20 pt-10">
          <button
            onClick={() => navigate("/roast")}
            className="font-mono text-xs font-bold uppercase tracking-widest text-cyber-white/40 hover:text-neon-red border-b border-transparent hover:border-neon-red transition-all pb-1"
          >
            [ REBOOT_SYSTEM ]
          </button>
        </div>
      </div>
    </main>
  );
}
