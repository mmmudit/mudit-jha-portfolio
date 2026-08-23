import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { AboutHeroSection } from "@/components/about-hero-section";
import { AboutEssaysSection } from "@/components/about-essays-section";
import { AboutReadsSection } from "@/components/about-reads-section";
import { AboutMusicSection } from "@/components/about-music-section";
import { AboutMomentsSection } from "@/components/about-moments-section";
import { MagneticScroll } from "@/components/magnetic-scroll";

export const revalidate = 0;

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Gentle Magnetic Auto-Centering for Sections */}
      <MagneticScroll selector="[data-magnetic-section]" />

      <div className="flex w-full flex-col gap-14 sm:gap-20">
        {/* 1. Hero & Bio Profile Section */}
        <section data-magnetic-section className="w-full scroll-mt-24">
          <AboutHeroSection />
        </section>

        <Divider />

        {/* 2. Essays I've Written Section */}
        <section data-magnetic-section className="w-full scroll-mt-24">
          <AboutEssaysSection />
        </section>

        <Divider />

        {/* 3. Reads That Keep Me Sharp Section */}
        <section data-magnetic-section className="w-full scroll-mt-24">
          <AboutReadsSection />
        </section>

        <Divider />

        {/* 4. Music That Energize My Section */}
        <section data-magnetic-section className="w-full scroll-mt-24">
          <AboutMusicSection />
        </section>

        <Divider />

        {/* 5. Moments That Stuck Section with dynamic quote */}
        <section data-magnetic-section className="w-full scroll-mt-24">
          <AboutMomentsSection />
        </section>

        <Divider />

        {/* 6. Page Footer */}
        <Footer />
      </div>
    </main>
  );
}
