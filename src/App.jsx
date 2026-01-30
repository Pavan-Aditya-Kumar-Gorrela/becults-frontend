import { Routes, Route } from 'react-router-dom';
import GetInTouch from './sections/get-in-touch';
import OurTestimonials from './sections/our-testimonials';
import SubscribeNewsletter from './sections/subscribe-newsletter';
import TrustedCompanies from './sections/trusted-companies';
import Footer from './components/footer';
import Navbar from './components/navbar';
import AboutOurApps from './sections/about-our-apps';
import HeroSection from './sections/hero-section';
import OurLatestCreation from './sections/our-latest-creation';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import GitHubCallback from './pages/GitHubCallback';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function LandingPage() {
  return (
    <>
      <Navbar />
      
      <main className="px-6 md:px-16 lg:px-24 xl:px-32  text-white">
        <HeroSection />
        <OurLatestCreation />
        <AboutOurApps />
        <OurTestimonials />
        <TrustedCompanies />
        <GetInTouch />
        <SubscribeNewsletter />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
      
      {/* User Routes */}
      <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
    </Routes>
  );
}
