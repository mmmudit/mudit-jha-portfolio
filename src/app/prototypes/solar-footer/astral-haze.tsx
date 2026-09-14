import { FooterStudyFrame } from "./footer-study-frame";
import { OrganicStars } from "./organic-stars";
import styles from "./solar-footer.module.css";

export function AstralHaze() {
  return (
    <FooterStudyFrame label="Diffuse astral haze with sunlit dust and stars">
      <OrganicStars tone="haze" />
      <div className={styles.astralHaze} aria-hidden="true">
        <span className={styles.hazeBloom} />
        <span className={styles.hazeRibbon} />
        <span className={styles.hazeMote} />
      </div>
    </FooterStudyFrame>
  );
}
