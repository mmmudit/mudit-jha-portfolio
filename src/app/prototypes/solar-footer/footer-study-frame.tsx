import type { ReactNode } from "react";
import styles from "./solar-footer.module.css";

const socialLinks = ["insta", "linkedin", "github", "x", "substack", "email"];

export function FooterStudyFrame({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className={styles.footerContext}>
      <div className={styles.contactLead}>
        <p className={styles.sayHi}>say hi!</p>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chevron}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <nav className={styles.socialLinks} aria-label="Social links preview">
        {socialLinks.map((link) => (
          <a href="#footer-study" key={link} onClick={(event) => event.preventDefault()}>
            {link}
          </a>
        ))}
      </nav>

      <section id="footer-study" className={styles.footerPanel} aria-label={label}>
        {children}
        <div className={styles.footerContent}>
          <div className={styles.metadataBar}>
            <span>CHICAGO · AMERICA/CHICAGO</span>
            <span>© 2026 MUDIT JHA</span>
            <span>SOLAR STUDY · LIVE</span>
          </div>
          <div className={styles.wordmark} aria-label="Mudit">
            mudit
          </div>
        </div>
      </section>
    </div>
  );
}
