import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "./components/ui/toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/navbar";
import { Footer } from "./components/footer";
import HomePage from "./pages/home";
import SignInPage from "./pages/sign-in";
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
            <main className="pt-16 flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/learn" element={
                  <ProtectedRoute>
                    <LearnPage />
                  </ProtectedRoute>
                } />
                <Route path="/prompt-learning" element={
                  <ProtectedRoute>
                    <PromptLearningPage />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;