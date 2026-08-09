import { LiveClock } from "./live-clock";

export function Intro() {
  return (
    <section className="flex flex-col gap-4">
      <LiveClock />
      <h1 className="font-display text-[36px] font-semibold tracking-[-3px] text-zinc-800 text-balance">
        mudit jha
      </h1>

      <p className="shimmer shimmer-spread-16 shimmer-angle-45 shimmer-color-[#c8d5bb] shimmer-duration-7500 max-w-[688px] font-display text-[18px] font-medium leading-6 tracking-[-0.1px] text-button-secondary text-pretty">
        Design engineer & creative generalist. Building thoughtful things at the
        intersection of tech and{" "}
        <span className="font-hand text-[20px] leading-6 text-button-secondary">
          human
        </span>{" "}
        behavior.
      </p>
    </section>
  );
}
