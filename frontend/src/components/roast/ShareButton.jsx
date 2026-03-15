import { useState } from "react";
import { Copy, Terminal } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton({ shareQuote, grade, score }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = `🔥 ROAST_PROTOCOL // STATUS: COMPLETED\n[CLASS: ${grade}] // [SCORE: ${score}/100]\n\n>"${shareQuote}"\n\nINITIATE YOUR OWN SCAN -> roastfol.io`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("DATA_EXTRACTED_TO_CLIPBOARD 📋");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("ERR: CLIPBOARD_ACCESS_DENIED");
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-3 px-8 py-4 font-black text-lg uppercase tracking-widest
        transition-all duration-100 border-4 border-cyber-white group
        ${copied
          ? "bg-cyber-white text-cyber-black shadow-brutal-white translate-y-1"
          : "bg-cyber-black text-cyber-white hover:bg-cyber-white hover:text-cyber-black shadow-[4px_4px_0px_0px_#fff]"
        }
      `}
    >
      {copied ? (
        <>
          <Terminal className="w-5 h-5 shrink-0" />
          <span className="font-mono">DATA_COPIED</span>
        </>
      ) : (
        <>
          <Copy className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="font-mono">EXTRACT_RESULTS</span>
        </>
      )}
    </button>
  );
}
