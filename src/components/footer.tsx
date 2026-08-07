import { Divider } from "./divider";
import { LiveClock } from "./live-clock";

const socialLinks = [
  { label: "Instagram ↗", href: "https://instagram.com" },
  { label: "LinkedIn ↗", href: "https://linkedin.com" },
  { label: "Github ↗", href: "https://github.com" },
  { label: "X ↗", href: "https://x.com" },
  { label: "Substack ↗", href: "https://substack.com" },
  { label: "Email ↗", href: "mailto:hello@muditjha.com" },
] as const;

export function Footer() {
  return (
    <footer className="relative pt-12">
      <p className="absolute right-0 top-0 hidden font-hand text-[48px] tracking-[-1px] text-willow-grey lg:block">
        say hi ↓
      </p>

      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-28">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex max-w-[450px] flex-col gap-4">
              <p className="font-hand text-[clamp(4rem,12vw,8rem)] leading-none tracking-[-3px] text-rust-grey">
                mudit
              </p>
              <LiveClock />
              <p className="px-7 font-hand text-[16px] leading-4 text-rust-grey">
                &ldquo;cool quotes that tickle my mind&rdquo;
              </p>
            </div>

            <nav className="flex flex-col gap-7 font-sans text-[clamp(2rem,5vw,3rem)] font-semibold leading-[27px] tracking-[-1px] text-willow-grey">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="transition-opacity hover:opacity-70"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <Divider />
        </div>

        <div className="mx-auto flex w-[220px] flex-col items-center text-center">
          <a
            href="https://ethangwang.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 font-display text-[18px] font-medium tracking-[-0.1px] text-button-secondary transition-opacity hover:opacity-70"
          >
            © 2026 muditjha
          </a>
          <p className="p-2 text-[18px] font-light tracking-[-1px] text-button-secondary">
            CHANGELOG: 09-03-2003
          </p>
        </div>
      </div>
    </footer>
  );
}
