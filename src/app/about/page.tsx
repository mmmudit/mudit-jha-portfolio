import Link from "next/link";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-16">
      <div className="flex w-full flex-col gap-12">
        <section className="flex flex-col gap-6 pt-4">
          <h1 className="font-display text-[36px] font-semibold tracking-[-3px] text-zinc-800 text-balance">
            about
          </h1>

          <p className="max-w-[688px] font-display text-[18px] font-medium leading-6 tracking-[-0.1px] text-button-secondary text-pretty">
            Design engineer & creative generalist. Building thoughtful things at the
            intersection of tech and human behavior.
          </p>

          <p className="max-w-[688px] font-sans text-base leading-relaxed text-zinc-600 text-pretty">
            I craft digital software with an obsessive focus on tactile materials, spatial flow, and fluid motion physics.
            Currently exploring spatial computing, interactive Web Audio shaders, and high-craft design systems.
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="pressable inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800 [@media(hover:hover)]:hover:text-zinc-600"
            >
              ← Back to work
            </Link>
          </div>
        </section>

        <Divider />
        <Footer />
      </div>
    </main>
  );
}
