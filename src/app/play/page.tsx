import Link from "next/link";

export default function PlayPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-semibold mb-4">Play</h1>
      <p className="max-w-prose text-lg text-muted-foreground mb-6">
        This is a placeholder page for experimental projects and demos.
      </p>

      <div className="flex gap-1">
        <Link href="/" className="text-button-primary hover:underline">
          Back home
        </Link>
      </div>
    </main>
  );
}
