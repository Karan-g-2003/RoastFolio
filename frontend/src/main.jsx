import React                    from "react";
import ReactDOM                 from "react-dom/client";
import { BrowserRouter }        from "react-router-dom";
import { QueryClient,
         QueryClientProvider }  from "@tanstack/react-query";
import { Toaster }              from "react-hot-toast";
import App                      from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

// ── Clerk is optional until Week 3 ──────────────────────────────
// If no Clerk key is set, we skip ClerkProvider entirely.
// This lets the app run without auth during development.
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
let clerkAvailable = false;

function AppWrapper({ children }) {
  // Only wrap with ClerkProvider if we have a real key
  if (clerkAvailable) {
    // Dynamic import handled at top level — see below
    const { ClerkProvider } = window.__clerkModule;
    return <ClerkProvider publishableKey={CLERK_KEY}>{children}</ClerkProvider>;
  }
  return <>{children}</>;
}

// Check if Clerk key looks real (not a placeholder)
if (CLERK_KEY && !CLERK_KEY.includes("your_") && !CLERK_KEY.includes("placeholder")) {
  import("@clerk/clerk-react").then((mod) => {
    window.__clerkModule = mod;
    clerkAvailable = true;
    renderApp();
  }).catch(() => {
    console.warn("Clerk failed to load — running without auth.");
    renderApp();
  });
} else {
  console.log("ℹ️  No Clerk key configured — running without auth. (This is fine for Week 2)");
  renderApp();
}

function renderApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#2D2D2D",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.08)",
                },
              }}
            />
          </BrowserRouter>
        </QueryClientProvider>
      </AppWrapper>
    </React.StrictMode>
  );
}
