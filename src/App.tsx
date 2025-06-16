import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserProfile } from './components/auth/UserProfile';

// Landing page components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Curriculum } from './components/sections/Curriculum';
import { Testimonials } from './components/sections/Testimonials';
import { Pricing } from './components/sections/Pricing';
import { CTA } from './components/sections/CTA';

const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main>
      <Hero />
      <Features />
      <div id="curriculum">
        <Curriculum />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <CTA />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth page - redirect if already authenticated */}
          <Route 
            path="/auth" 
            element={
              <ProtectedRoute requireAuth={false}>
                <AuthPage />
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
            <Route path="courses" element={<div className="p-8 text-center">Courses coming soon!</div>} />
            <Route path="community" element={<div className="p-8 text-center">Community coming soon!</div>} />
            <Route path="achievements" element={<div className="p-8 text-center">Achievements coming soon!</div>} />
            <Route path="settings" element={<div className="p-8 text-center">Settings coming soon!</div>} />
          </Route>
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/profile" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<UserProfile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;