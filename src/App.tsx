import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "./components/ui/toaster";
import Navbar from "./components/navbar";
import { Footer } from "./components/footer";
import HomePage from "./pages/home";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import DashboardPage from "./pages/dashboard";
import LearnPage from "./pages/learn";
import LeaderboardPage from "./pages/leaderboard";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="promptly-theme">
          <Router>
            <ToastProvider>
              <div className="relative flex min-h-screen flex-col antialiased">
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/sign-in/*" element={<SignInPage />} />
                  <Route path="/sign-up/*" element={<SignUpPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                </Routes>
                <Footer />
              </div>
            </ToastProvider>
          </Router>
        </ThemeProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  );
}

export default App;