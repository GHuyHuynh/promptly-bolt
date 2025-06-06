import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "./components/ui/toaster";
import Navbar from "./components/navbar";
import { Footer } from "./components/footer";
import HomePage from "./pages/home";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="promptly-theme">
      <Router>
        <ToastProvider>
          <div className="relative flex min-h-screen flex-col antialiased">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
            </Routes>
            <Footer />
          </div>
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;