import { InfiniteCanvas } from "@/components/infinite-canvas";
import { client } from "@/sanity/client";
import { PLAY_ITEMS_QUERY } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlayPage() {
  let playItems: any[] = [];
  try {
    playItems = await client.fetch(PLAY_ITEMS_QUERY, {}, { cache: "no-store" });
  } catch {
    playItems = [];
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-dough z-0">
      <InfiniteCanvas items={playItems} />
    </div>
  );
}
