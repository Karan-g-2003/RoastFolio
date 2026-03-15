import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { Terminal, Database, ShieldAlert, ArrowRight } from "lucide-react";
import { getUserHistory } from "../lib/api.js";

export default function DashboardPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      if (!isLoaded || !userId) {
        setLoading(false);
        return;
      }
      try {
        const token = await getToken();
        if (token) {
          const data = await getUserHistory(token);
          setHistory(data || []);
        }
      } catch (err) {
        console.error("Failed to load history", err);
        setError("FAILED TO RETRIEVE LOGS.");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [isLoaded, userId, getToken]);

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-cyber-black flex items-center justify-center font-mono text-neon-green">
        <div className="animate-pulse flex items-center gap-4">
          <Database className="w-6 h-6 animate-bounce" />
          &gt; ACCESSING_SECURE_ARCHIVES...
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-cyber-black px-4 py-32 font-sans flex items-center justify-center">
        <div className="max-w-lg w-full bg-cyber-black border-2 border-neon-red p-8 shadow-brutal-red text-center">
          <ShieldAlert className="w-16 h-16 text-neon-red mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-black uppercase tracking-widest text-cyber-white mb-4">
            ACCESS_DENIED
          </h2>
          <p className="font-mono text-cyber-white/60 mb-8">
            // UNIDENTIFIED_USER_DETECTED <br/>
            // AUTHENTICATION_REQUIRED_FOR_LOGS
          </p>
          <SignInButton mode="modal">
            <button className="cyber-button w-full border-neon-red text-neon-red hover:bg-neon-red hover:text-cyber-black transition-colors py-4 text-xl">
              AUTHENTICATE_NOW
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cyber-black px-4 py-16 sm:py-24 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 border-b-2 border-neon-green pb-6 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-cyber-white mb-2 glitch-text">
            DATABASE_<span className="text-neon-green">ARCHIVES</span>
          </h1>
          <p className="font-mono text-neon-green flex items-center justify-center sm:justify-start gap-2">
            <Terminal className="w-4 h-4" /> 
            <span className="cursor">&gt; COMMAND_HISTORY // your previous evaluations</span>
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-neon-red/10 border border-neon-red text-neon-red font-mono">
            Error: {error}
          </div>
        )}

        {history.length === 0 && !error ? (
          <div className="border border-cyber-white/20 p-12 text-center bg-[#0a0a0a]">
            <p className="font-mono text-cyber-white/60 mb-6 text-lg">
              NO_LOGS_FOUND // run your first scan
            </p>
            <Link to="/roast" className="cyber-button text-neon-blue border-neon-blue inline-flex items-center gap-2">
              INITIATE_SCAN <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-cyber-white/20 bg-[#0a0a0a] shadow-brutal-white font-mono">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-cyber-white/10 text-cyber-white text-xs tracking-widest uppercase border-b-2 border-cyber-white/20">
                  <th className="p-4">[ DATE ]</th>
                  <th className="p-4">[ GRADE ]</th>
                  <th className="p-4">[ SCORE ]</th>
                  <th className="p-4">[ ARCHETYPE ]</th>
                  <th className="p-4 text-right">[ ACTION ]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-white/10 text-sm text-cyber-white flex-col">
                {history.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-cyber-white/5 transition-colors group">
                      <td className="p-4 text-cyber-white/80 whitespace-nowrap">
                        {new Date(item.created_at).toISOString().split('T')[0]}
                      </td>
                      <td className={`p-4 font-black text-lg ${getGradeColor(item.overall_grade)}`}>
                        [{item.overall_grade || '?'}]
                      </td>
                      <td className="p-4 text-cyber-white/80">
                        {item.overall_score || 0}/100
                      </td>
                      <td className="p-4 text-cyber-white/80">
                        {item.archetype || "UNKNOWN"}
                      </td>
                      <td className="p-4 text-right">
                        <Link 
                          to={`/result/${item.id}`}
                          className="text-neon-blue hover:text-neon-green transition-colors inline-flex items-center gap-1 opacity-70 group-hover:opacity-100"
                        >
                          VIEW_LOG <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function getGradeColor(grade) {
  switch (grade) {
    case 'S': return 'text-neon-blue';
    case 'A': return 'text-neon-green';
    case 'B': return 'text-neon-yellow';
    case 'C': return 'text-[#ff8c00]';
    case 'D': return 'text-neon-red';
    case 'F': return 'text-[#8b0000]';
    default: return 'text-cyber-white';
  }
}
