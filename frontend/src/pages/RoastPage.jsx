import { useState, useEffect }     from "react";
import { useNavigate }  from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, Terminal, AlertTriangle, ChevronRight } from "lucide-react";
import toast             from "react-hot-toast";
import ModeSelector      from "../components/roast/ModeSelector.jsx";
import DropZone          from "../components/roast/DropZone.jsx";
import { submitRoast }   from "../lib/api.js";

const LOADING_STEPS = [
  { text: "> INITIALIZING_SCAN...", progress: "[████░░░░░░] 40%" },
  { text: "> SCRAPING_PORTFOLIO...", progress: "[████████░░] 80%" },
  { text: "> RUNNING_AI_ANALYSIS...", progress: "[██████████] 100%" },
  { text: "> COMPILING_RESULTS...", progress: "" }
];

function LoadingSequence() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= LOADING_STEPS.length - 1) return;
    const timer = setTimeout(() => {
      setStep(s => s + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="w-full bg-cyber-black border-2 border-neon-green p-6 font-mono text-neon-green shadow-[0_0_15px_rgba(0,255,65,0.2)] text-sm sm:text-base">
      <div className="space-y-2">
        {LOADING_STEPS.slice(0, step + 1).map((s, i) => (
          <div key={i} className="flex justify-between items-center">
            <span>{s.text}</span>
            <span>{s.progress}</span>
          </div>
        ))}
        {step < LOADING_STEPS.length - 1 && (
          <div className="mt-2 animate-pulse">_</div>
        )}
      </div>
    </div>
  );
}

export default function RoastPage() {
  const { getToken, userId } = useAuth();
  const navigate = useNavigate();

  const [url, setUrl]       = useState("");
  const [mode, setMode]     = useState("honest");
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validate — need at least one input
    if (!url.trim() && !file) {
      setError("ERR_MISSING_INPUT: PROVIDE A URL OR PDF TO INITIATE SCAN.");
      return;
    }

    // Basic URL validation
    if (url.trim() && !url.trim().startsWith("http")) {
      setError("ERR_INVALID_URL: PROTOCOL 'HTTP/HTTPS' REQUIRED.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const result = await submitRoast({
        url: url.trim() || undefined,
        file: file || undefined,
        mode,
        token,
        userId,
      });
      // Navigate to result page, passing data via state
      navigate("/result/latest", { state: { roast: result } });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || "SYSTEM_FAILURE: UNKNOWN ERROR OCCURRED";
      setError(message.toUpperCase());
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cyber-black px-4 py-16 sm:py-24 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-red text-cyber-black text-sm font-mono font-bold tracking-widest uppercase mb-6 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            Warning: Roast Protocol
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-cyber-white leading-none mb-4 glitch-text">
            INITIATE_SCAN <br/>
            <span className="text-neon-red">PROTOCOL</span>
          </h1>
        </div>

        {/* ── Terminal Form ── */}
        <div className="bg-cyber-black border-2 border-cyber-white p-1 shadow-brutal-white">
          <div className="border border-cyber-white/30 p-6 sm:p-10">
            
            <div className="mb-8 font-mono text-cyber-white/80 border-b border-cyber-white/20 pb-4">
              <p className="text-neon-green flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="cursor">&gt; INITIATE_SCAN_PROTOCOL</span>
              </p>
              <p className="text-cyber-white/50 mt-2">
                // provide target assets for analysis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* URL Input */}
              <div className="space-y-3 relative group">
                <label htmlFor="portfolio-url" className="text-sm font-mono font-bold tracking-widest text-cyber-white uppercase block">
                  TARGET_URL:
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-mono text-neon-green font-bold">
                    &gt;
                  </span>
                  <input
                    id="portfolio-url"
                    type="url"
                    placeholder="https://___________________________"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[#0a0a0a] text-neon-green font-mono border border-cyber-white/20 
                               focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] outline-none py-4 pl-10 pr-4 transition-all
                               disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="text-center font-mono text-cyber-white/40 tracking-[0.3em]">
                ——— AND/OR ———
              </div>

              {/* PDF Upload */}
              <div className="space-y-3">
                <label className="text-sm font-mono font-bold tracking-widest text-cyber-white uppercase block">
                  RESUME_UPLOAD:
                </label>
                <div className="border border-cyber-white/20 bg-[#0a0a0a] p-2">
                  <DropZone
                    file={file}
                    onFileSelect={setFile}
                    onFileRemove={() => setFile(null)}
                  />
                </div>
              </div>
              
              <div className="border-b border-cyber-white/20 pt-2"></div>

              {/* Mode Selector */}
              <div className="space-y-4">
                <label className="text-sm font-mono font-bold tracking-widest text-cyber-white uppercase block">
                  SELECT_PROTOCOL:
                </label>
                <ModeSelector selected={mode} onSelect={setMode} />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-neon-red/10 border border-neon-red text-neon-red font-mono text-sm shadow-[0_0_10px_rgba(255,0,60,0.2)]">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold underline">FATAL EXCEPTION:</span><br/>
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button OR Loading Screen */}
              <div className="pt-6">
                {loading ? (
                  <LoadingSequence />
                ) : (
                  <button
                    type="submit"
                    className="
                      w-full py-5 font-mono font-bold text-xl tracking-widest uppercase
                      bg-cyber-black text-cyber-white border-2 border-neon-green
                      hover:bg-neon-green hover:text-cyber-black transition-colors duration-200
                      hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]
                    "
                  >
                    [████████████] RUN_ROAST.EXE
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
