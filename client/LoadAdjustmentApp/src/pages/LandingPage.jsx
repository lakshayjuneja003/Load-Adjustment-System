import '../css/Landing.css';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import RolesSection from '../components/landing/RolesSection';
import { CTASection, Footer } from '../components/landing/CTAFooter';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <RolesSection />
      <CTASection />
      <Footer />
    </>
  );
}
