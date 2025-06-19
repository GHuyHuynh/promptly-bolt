import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserProfile } from './components/auth/UserProfile';

// Course components from examples
import { 
  CourseDashboard, 
  CourseCatalog, 
  CoursePlayer,
  XPProgressWidget 
} from './examples/course-hook-usage';

// Course hooks
import { useUserStats, useXPSystem } from './hooks/useCourse';

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
      <CourseProvider>
        <Router>
          <div className="App">
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
                <Route path="dashboard" element={<CourseDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                
                {/* Course-related routes */}
                <Route path="courses" element={<CourseCatalog />} />
                <Route path="courses/:courseId" element={<CoursePlayerRoute />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                
                {/* Other routes */}
                <Route path="community" element={<div className="p-8 text-center">Community coming soon!</div>} />
                <Route path="settings" element={<div className="p-8 text-center">Settings coming soon!</div>} />
              </Route>
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<CourseDashboard />} />
              </Route>
              <Route path="/profile" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<UserProfile />} />
              </Route>
            </Routes>

            {/* Global toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

// Route component for course player
const CoursePlayerRoute: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  if (!courseId) {
    return <div>Course not found</div>;
  }
  
  return <CoursePlayer courseId={courseId} />;
};

// Progress page component
const ProgressPage: React.FC = () => {
  return (
    <div className="progress-page">
      <h1>Your Learning Progress</h1>
      <div className="progress-layout">
        <div className="main-content">
          <CourseDashboard />
        </div>
        <div className="sidebar">
          <XPProgressWidget />
        </div>
      </div>
    </div>
  );
};

// Achievements page component
const AchievementsPage: React.FC = () => {
  const { stats, loading } = useUserStats();
  const { userXP } = useXPSystem();
  
  if (loading) {
    return <div>Loading achievements...</div>;
  }

  return (
    <div className="achievements-page">
      <h1>Your Achievements</h1>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Level</h3>
          <p className="stat-value">{userXP?.currentLevel || 1}</p>
        </div>
        <div className="stat-card">
          <h3>Total XP</h3>
          <p className="stat-value">{userXP?.totalXP || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Courses Completed</h3>
          <p className="stat-value">{stats?.totalCoursesCompleted || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Current Streak</h3>
          <p className="stat-value">{stats?.currentStreak || 0} days</p>
        </div>
      </div>

      <div className="achievements-grid">
        <h2>Achievements</h2>
        {stats?.achievements.length ? (
          <div className="achievements-list">
            {stats.achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <img src={achievement.iconUrl} alt={achievement.name} />
                <div className="achievement-info">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">
                    Earned on {achievement.earnedAt.toLocaleDateString()}
                  </span>
                </div>
                <div className={`achievement-rarity ${achievement.type}`}>
                  {achievement.type}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-achievements">
            <p>Start learning to unlock achievements!</p>
          </div>
        )}
      </div>

      <div className="badges-section">
        <h2>Badges</h2>
        {userXP?.badges.length ? (
          <div className="badges-grid">
            {userXP.badges.map((badge) => (
              <div key={badge.id} className="badge-card">
                <img src={badge.iconUrl} alt={badge.name} />
                <div className="badge-info">
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                  <span className={`badge-rarity ${badge.rarity}`}>
                    {badge.rarity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-badges">
            <p>Complete more courses to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;