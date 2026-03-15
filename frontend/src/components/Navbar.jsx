import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

export default function Navbar() {
  const clerkMod = window.__clerkModule;
  const SignedIn = clerkMod?.SignedIn;
  const SignedOut = clerkMod?.SignedOut;
  const UserButton = clerkMod?.UserButton;
  const SignInButton = clerkMod?.SignInButton;

  return (
    <nav className="absolute top-0 w-full p-4 sm:p-6 z-50 flex flex-wrap justify-between items-center bg-transparent pointer-events-auto">
      <Link to="/" className="flex items-center gap-3 text-cyber-white no-underline group hover:text-neon-green transition-colors mb-4 md:mb-0">
        <Terminal className="w-6 h-6 group-hover:animate-pulse" />
        <span className="font-mono font-black tracking-widest uppercase">RoastFolio_OS</span>
      </Link>
      
      <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm tracking-widest">
        <Link to="/dashboard" className="text-cyber-white hover:text-neon-blue transition-colors">
          [ ARCHIVES ]
        </Link>
        <Link to="/roast" className="text-cyber-white hover:text-neon-red transition-colors">
          [ SCAN_TARGET ]
        </Link>
        
        {clerkMod ? (
          <>
            <SignedIn>
              <div className="border border-neon-green bg-cyber-black p-0.5 rounded-sm hover:-translate-y-0.5 transition-transform cursor-pointer">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-8 w-8 rounded-none border-none" } }} />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="border-2 border-neon-green text-neon-green px-3 py-1.5 hover:bg-neon-green hover:text-cyber-black transition-colors font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#00ff41] active:translate-y-1 active:shadow-none">
                  LOGIN
                </button>
              </SignInButton>
            </SignedOut>
          </>
        ) : (
          <div className="text-cyber-white/50 border border-cyber-white/20 px-2 py-1">
            AUTH_OFFLINE
          </div>
        )}
      </div>
    </nav>
  );
}
