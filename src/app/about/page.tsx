import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { AboutHeroSection } from "@/components/about-hero-section";
import { AboutEssaysSection } from "@/components/about-essays-section";
import { AboutReadsSection } from "@/components/about-reads-section";
import { AboutMusicSection } from "@/components/about-music-section";
import { AboutMomentsSection } from "@/components/about-moments-section";
import { MagneticScroll } from "@/components/magnetic-scroll";
import { MobileScrollReveal } from "@/components/mobile-scroll-reveal";

export const revalidate = 0;

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Gentle Magnetic Auto-Centering for Sections */}
      <MagneticScroll selector="[data-magnetic-section]" />

      <div className="flex w-full flex-col gap-14 sm:gap-20">
        {/* 1. Hero & Bio Profile Section */}
        <section data-about-section="hero" className="w-full pb-10 sm:pb-20">
          <MobileScrollReveal>
            <AboutHeroSection />
          </MobileScrollReveal>
        </section>

        <Divider />

        {/* 2. Essays I've Written Section */}
        <section data-about-section="essays" className="w-full scroll-mt-28 pt-8 sm:pt-14">
          <MobileScrollReveal>
            <AboutEssaysSection />
          </MobileScrollReveal>
        </section>

        <Divider />

        {/* 3. Reads That Keep Me Sharp Section */}
        <section data-about-section="reads" data-magnetic-section className="w-full scroll-mt-24">
          <MobileScrollReveal>
            <AboutReadsSection />
          </MobileScrollReveal>
        </section>

        <Divider />

        {/* 4. Music That Energize My Section */}
        <section data-about-section="music" data-magnetic-section className="w-full scroll-mt-24">
          <MobileScrollReveal>
            <AboutMusicSection />
          </MobileScrollReveal>
        </section>

        <Divider />

        {/* 5. Moments That Stuck Section with dynamic quote */}
        <section data-about-section="moments" data-magnetic-section className="w-full scroll-mt-24">
          <MobileScrollReveal>
            <AboutMomentsSection />
          </MobileScrollReveal>
        </section>

        <Divider />

        {/* 6. Page Footer */}
        <Footer />
      </div>
    </main>
  );
}
