import { NoiseOverlay } from '@/components/landing/NoiseOverlay';
import { LandingNavbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Protocol } from '@/components/landing/Protocol';
import { LandingFooter } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="landing-theme bg-canvas text-textMain font-body selection:bg-primary selection:text-white relative transition-colors duration-500 min-h-screen">
      <div className="bg-orbs"></div>
      <NoiseOverlay />
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <Protocol />
      </main>
      <LandingFooter />
    </div>
  );
}
