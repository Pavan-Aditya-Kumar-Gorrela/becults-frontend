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

function HomePage() {
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
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
