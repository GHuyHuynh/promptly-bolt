import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "./components/ui/toaster";
import Navbar from "./components/navbar";
import { Footer } from "./components/footer";
import HomePage from "./pages/home";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import DashboardPage from "./pages/dashboard";
import LearnPage from "./pages/learn";
import PromptLearningPage from "./pages/prompt-learning";
import LeaderboardPage from "./pages/leaderboard";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="promptly-theme">
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ToastProvider>
          <div className="relative flex min-h-screen flex-col antialiased">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/prompt-learning" element={<PromptLearningPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
            <Footer />
          </div>
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;