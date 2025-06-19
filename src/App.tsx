import React, { Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthPage } from "./components/auth/AuthPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import { UserProfile } from "./components/auth/UserProfile";

// Landing page components
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Features } from "./components/sections/Features";
import { Curriculum } from "./components/sections/Curriculum";
import { Pricing } from "./components/sections/Pricing";
import { CTA } from "./components/sections/CTA";

// Enhanced Loading Component with multiple states
const LoadingSpinner: React.FC<{
  message?: string;
  variant?: "default" | "minimal" | "elaborate";
}> = ({ message = "Loading...", variant = "default" }) => {
  const [loadingTip, setLoadingTip] = useState(0);
  const tips = [
    "Preparing your learning experience...",
    "Optimizing AI knowledge for you...",
    "Almost ready to transform your skills...",
    "Connecting to the future of learning...",
  ];

  useEffect(() => {
    if (variant === "elaborate") {
      const interval = setInterval(() => {
        setLoadingTip((prev) => (prev + 1) % tips.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [variant]);

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    );
  }

  if (variant === "elaborate") {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-neutral-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          {/* Animated Logo */}
          <motion.div
            className="relative mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">P</span>
            </div>
          </motion.div>

          {/* Loading Animation */}
          <div className="space-y-4">
            <motion.div
              className="flex justify-center space-x-1"
              initial="hidden"
              animate="visible"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-primary-600 rounded-full"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.2,
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    },
                  }}
                />
              ))}
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Dynamic Loading Message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingTip}
                className="text-neutral-600 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {tips[loadingTip]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
        <p className="text-neutral-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Enhanced Error Fallback Component
const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate retry delay
    setIsRetrying(false);
    resetErrorBoundary();
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-6 max-w-md mx-auto">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">
            Oops! Something went wrong
          </h2>
          <p className="text-neutral-600">
            We encountered an unexpected error. Don't worry, our team has been
            notified.
          </p>
        </div>

        <details className="text-left bg-neutral-100 rounded-lg p-4">
          <summary className="cursor-pointer font-medium text-neutral-700 hover:text-neutral-900">
            Technical Details
          </summary>
          <pre className="mt-2 text-xs text-neutral-600 overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isRetrying ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Connection Status Component
const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium z-[60]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
    >
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        You're currently offline. Some features may be limited.
      </div>
    </motion.div>
  );
};

// Page Transition Wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Landing Page with scroll animations
const LandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header />
      <main className="relative">
        {/* Parallax Background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: Math.max(0, 1 - scrollY / 800),
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-neutral-50/30" />
        </div>

        <Hero />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Features />
        </motion.div>

        <motion.div
          id="curriculum"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Curriculum />
        </motion.div>

        <motion.div
          id="pricing"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Pricing />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CTA />
        </motion.div>
      </main>
      <Footer />
    </motion.div>
  );
};

// Enhanced placeholder components with loading states
const ComingSoonPage: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <motion.div
    className="p-8 text-center min-h-[60vh] flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="max-w-md mx-auto space-y-6">
      <motion.div
        className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">🚀</span>
        </div>
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
        <p className="text-neutral-600">
          {subtitle ||
            "We're working hard to bring you something amazing. Stay tuned!"}
        </p>
      </div>

      <div className="w-48 h-2 bg-neutral-200 rounded-full overflow-hidden mx-auto">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
          initial={{ width: "0%" }}
          animate={{ width: "75%" }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>

      <p className="text-sm text-neutral-500">75% Complete</p>
    </div>
  </motion.div>
);

function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return <LoadingSpinner variant="elaborate" />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Application error:", error, errorInfo);
        // In production, send to error tracking service
      }}
    >
      <ConnectionStatus />

      <AuthProvider>
        <Router>
          <PageTransition>
            <Suspense fallback={<LoadingSpinner variant="elaborate" />}>
              <Routes>
                {/* Public landing page */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth page - redirect if already authenticated */}
                <Route
                  path="/auth"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <AuthPage />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />

                {/* Protected app routes */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route
                    path="courses"
                    element={
                      <ComingSoonPage
                        title="Courses Coming Soon!"
                        subtitle="Interactive AI courses with hands-on projects and expert guidance."
                      />
                    }
                  />
                  <Route
                    path="community"
                    element={
                      <ComingSoonPage
                        title="Community Coming Soon!"
                        subtitle="Connect with fellow AI learners and share your journey."
                      />
                    }
                  />
                  <Route
                    path="achievements"
                    element={
                      <ComingSoonPage
                        title="Achievements Coming Soon!"
                        subtitle="Track your progress and earn badges as you master AI."
                      />
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ComingSoonPage
                        title="Settings Coming Soon!"
                        subtitle="Customize your learning experience and preferences."
                      />
                    }
                  />
                </Route>

                {/* Legacy routes for backward compatibility */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                </Route>
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<UserProfile />} />
                </Route>
              </Routes>
            </Suspense>
          </PageTransition>
        </Router>
      </AuthProvider>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#171717",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          loading: {
            iconTheme: {
              primary: "#6366f1",
              secondary: "#fff",
            },
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
