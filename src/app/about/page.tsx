import Link from "next/link";


export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-semibold mb-4">About</h1>
      <p className="max-w-prose text-lg text-muted-foreground mb-6">
        This site is a personal portfolio built with Next.js and TypeScript.
      </p>

      <div className="flex gap-4">
        <Link href="/" className="text-button-primary hover:underline">
          Back home
        </Link>
      </div>
    </main>
  );
}
