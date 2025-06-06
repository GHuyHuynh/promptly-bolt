import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "./components/ui/toaster";
import Navbar from "./components/navbar";
import { Footer } from "./components/footer";
import HomePage from "./pages/home";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ThemeProvider defaultTheme="system" storageKey="promptly-theme">
        <Router>
          <ToastProvider>
            <div className="relative flex min-h-screen flex-col antialiased">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
              <Footer />
            </div>
          </ToastProvider>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;