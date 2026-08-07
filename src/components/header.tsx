import Image from "next/image";

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="size-[100px] shrink-0 overflow-hidden rounded-[60px] bg-zinc-300">
        <Image
          src="/assets/avatar.png"
          alt="Mudit Jha"
          width={100}
          height={100}
          className="size-full object-cover"
          priority
        />
      </div>

      <a
        href="mailto:hello@muditjha.com"
        className="relative flex size-[54px] shrink-0 items-center justify-center rounded-full border-[3px] border-zinc-300 bg-dough transition-opacity hover:opacity-80"
        aria-label="Email Mudit Jha"
      >
        <Image
          src="/assets/mail-icon.svg"
          alt=""
          width={24}
          height={24}
          className="size-[24px]"
        />
      </a>
    </header>
  );
}
