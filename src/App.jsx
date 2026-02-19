import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import OurTestimonials from './sections/our-testimonials';
import SubscribeNewsletter from './sections/subscribe-newsletter';
import Footer from './components/footer';
import Navbar from './components/navbar';
import AboutOurApps from './sections/about-our-apps';
import HeroSection from './sections/hero-section';
import OurLatestCreation from './sections/our-latest-creation';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import GitHubCallback from './pages/GitHubCallback';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCohortPanel from './pages/AdminCohortPanel';
import AdminCommunityChannels from './pages/AdminCommunityChannels';
import UpcomingCohorts from './pages/UpcomingCohorts';
import AdminSettings from './pages/AdminSettings';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CohortDetail from './pages/CohortDetail';
import NotFoundPage from './pages/404NotFoundPage';
import MeetOurTeam from './components/meet-our-team';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LandingPage() {
  return (
    <>
      <Navbar />
      
      <main className="px-6 md:px-16 lg:px-24 xl:px-32  text-white">
        <HeroSection />
        <OurLatestCreation />
        <AboutOurApps />
        <OurTestimonials />
        <SubscribeNewsletter />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/meet-our-team" element={<MeetOurTeam />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/github/callback" element={<GitHubCallback />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* User Routes */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/explore" element={<ProtectedRoute element={<Explore />} />} />
        <Route path="/upcoming-cohorts" element={<ProtectedRoute element={<UpcomingCohorts />} />} />
        <Route path="/cohort/:cohortId" element={<ProtectedRoute element={<CohortDetail />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/admin/cohorts" element={<AdminRoute element={<AdminCohortPanel />} />} />
        <Route path="/admin/channels" element={<AdminRoute element={<AdminCommunityChannels />} />} />
        <Route path="/admin/settings" element={<AdminRoute element={<AdminSettings />} />} />
      </Routes>
    </>
  );
}
