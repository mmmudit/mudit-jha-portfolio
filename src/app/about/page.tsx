import Link from "next/link";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { Bookshelf, type BookData } from "@/components/bookshelf";
import { TunesSection, type TuneData } from "@/components/tunes-section";
import { client } from "@/sanity/client";
import { BOOKS_QUERY, TUNES_QUERY } from "@/sanity/queries";

const defaultBooks: BookData[] = [
  {
    _id: "book-grid-systems",
    title: "Grid Systems in Graphic Design",
    author: "Josef Müller-Brockmann",
    authorInitials: "JMB",
    spineColor: "#ff4500",
    spineTextColor: "#ffffff",
    link: "https://www.google.com/search?q=Grid+Systems+in+Graphic+Design",
  },
  {
    _id: "book-refactoring-ui",
    title: "Refactoring UI",
    author: "Adam Wathan & Steve Schoger",
    authorInitials: "AW+SS",
    spineColor: "#293845",
    spineTextColor: "#ffffff",
    link: "https://refactoringui.com/",
  },
  {
    _id: "book-universal-ux",
    title: "Universal UX Principles",
    author: "I.P.",
    authorInitials: "IP",
    spineColor: "#1e242b",
    spineTextColor: "#ffffff",
    link: "#",
  },
  {
    _id: "book-just-enough",
    title: "Just Enough Research",
    author: "Erika Hall",
    authorInitials: "TS",
    spineColor: "#f1f5f9",
    spineTextColor: "#18181b",
    link: "#",
  },
  {
    _id: "book-creative-act",
    title: "The Creative Act: A Way of Being",
    author: "Rick Rubin",
    authorInitials: "RR",
    spineColor: "#cbd5e1",
    spineTextColor: "#18181b",
    link: "#",
  },
  {
    _id: "book-steal-like-an-artist",
    title: "Steal Like An Artist",
    author: "Austin Kleon",
    authorInitials: "AK",
    spineColor: "#27272a",
    spineTextColor: "#ffffff",
    link: "#",
  },
  {
    _id: "book-show-your-work",
    title: "Show Your Work!",
    author: "Austin Kleon",
    authorInitials: "AK",
    spineColor: "#eab308",
    spineTextColor: "#18181b",
    link: "#",
  },
  {
    _id: "book-build",
    title: "Build: An Unorthodox Guide",
    author: "Tony Fadell",
    authorInitials: "TF",
    spineColor: "#e2e8f0",
    spineTextColor: "#18181b",
    link: "#",
  },
  {
    _id: "book-rework",
    title: "Rework",
    author: "Jason Fried & DHH",
    authorInitials: "JF+DHH",
    spineColor: "#333336",
    spineTextColor: "#ffffff",
    link: "#",
  },
  {
    _id: "book-great-ceo",
    title: "The Great CEO Within",
    author: "Matt Mochary",
    authorInitials: "MM",
    spineColor: "#2e102e",
    spineTextColor: "#ffffff",
    link: "#",
  },
  {
    _id: "book-make-something",
    title: "Make Something Wonderful",
    author: "Steve Jobs Archive",
    authorInitials: "SJ",
    spineColor: "#94938d",
    spineTextColor: "#18181b",
    link: "#",
  },
  {
    _id: "book-how-to-american",
    title: "How to American",
    author: "Jimmy O. Yang",
    authorInitials: "JOY",
    spineColor: "#52525b",
    spineTextColor: "#ffffff",
    link: "#",
  },
  {
    _id: "book-sword-of-destiny",
    title: "Sword of Destiny",
    author: "Andrzej Sapkowski",
    authorInitials: "AS",
    spineColor: "#cbd5e1",
    spineTextColor: "#18181b",
    link: "#",
  },
  {
    _id: "book-hustle-smarter",
    title: "Hustle Harder, Hustle Smarter",
    author: "50 Cent",
    authorInitials: "50",
    spineColor: "#6b5e52",
    spineTextColor: "#ffffff",
    link: "#",
  },
  {
    _id: "book-subtle-art",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    authorInitials: "MM",
    spineColor: "#ea580c",
    spineTextColor: "#ffffff",
    link: "#",
  },
];

const defaultTunes: TuneData[] = [
  {
    _id: "tune-starboy",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    gradient: "from-rose-950 via-purple-950 to-zinc-950",
    link: "https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB",
  },
  {
    _id: "tune-give-or-take",
    title: "Lie Again",
    artist: "Giveon",
    album: "Give Or Take",
    gradient: "from-emerald-950 via-teal-950 to-zinc-950",
    link: "https://open.spotify.com/artist/4r63FhuTkWVT8Yjh1Toq8a",
  },
  {
    _id: "tune-amor",
    title: "SAOKO",
    artist: "Rosalía",
    album: "MOTOMAMI",
    gradient: "from-amber-100 via-stone-200 to-zinc-400",
    link: "https://open.spotify.com/artist/7ltDVBr6mUzFiKVWwvaWio",
  },
  {
    _id: "tune-vultures",
    title: "CARNIVAL",
    artist: "¥$, Kanye West, Ty Dolla $ign",
    album: "VULTURES 1",
    gradient: "from-zinc-900 via-stone-900 to-black",
    link: "https://open.spotify.com/artist/5K4W6rqBFWCANatrmFThBL",
  },
  {
    _id: "tune-redbone",
    title: "Redbone",
    artist: "Childish Gambino",
    album: "Awaken, My Love!",
    gradient: "from-blue-950 via-indigo-950 to-zinc-950",
    link: "https://open.spotify.com/track/0R2dqA9G91PHx36p7G11R0",
  },
  {
    _id: "tune-blinding-lights",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    gradient: "from-red-950 via-amber-950 to-black",
    link: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
  },
  {
    _id: "tune-get-lucky",
    title: "Get Lucky",
    artist: "Daft Punk ft. Pharrell Williams",
    album: "Random Access Memories",
    gradient: "from-amber-600 via-yellow-700 to-zinc-900",
    link: "https://open.spotify.com/track/69kOkL2khx23xsGl2dnePw",
  },
];

export default async function AboutPage() {
  let sanityBooks: BookData[] = [];
  let sanityTunes: TuneData[] = [];

  try {
    sanityBooks = await client.fetch(BOOKS_QUERY, {}, { next: { revalidate: 30 } });
    sanityTunes = await client.fetch(TUNES_QUERY, {}, { next: { revalidate: 30 } });
  } catch {
    sanityBooks = [];
    sanityTunes = [];
  }

  const books = sanityBooks && sanityBooks.length > 0 ? sanityBooks : defaultBooks;
  const tunes = sanityTunes && sanityTunes.length > 0 ? sanityTunes : defaultTunes;

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

        {/* Interactive Bookshelf Component connected to Sanity */}
        <Bookshelf books={books} />

        <Divider />

        {/* Interactive Tunes Accordion Fan Component connected to Sanity */}
        <TunesSection tunes={tunes} />

        <Divider />
        <Footer />
      </div>
    </main>
  );
}
