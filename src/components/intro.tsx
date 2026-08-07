import { Nav } from "./nav";

export function Intro() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-[36px] font-semibold tracking-[-3px] text-zinc-800">
        mudit jha
      </h1>

      <p className="max-w-[688px] font-display text-[18px] font-medium leading-6 tracking-[-0.1px] text-button-secondary">
        Design engineer & creative generalist. Building thoughtful things at the
        intersection of tech and{" "}
        <span className="font-hand text-[20px] leading-6 text-button-secondary">
          human
        </span>{" "}
        behavior.
      </p>

      <Nav />
    </section>
  );
}
