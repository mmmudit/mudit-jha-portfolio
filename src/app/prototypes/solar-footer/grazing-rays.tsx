import { FooterStudyFrame } from "./footer-study-frame";
import { OrganicStars } from "./organic-stars";
import styles from "./solar-footer.module.css";

export function GrazingRays() {
  return (
    <FooterStudyFrame label="Grazing solar rays in an organic star field">
      <OrganicStars tone="grazing" />
      <div className={styles.grazingGlare} aria-hidden="true">
        <span className={styles.grazingBloom} />
        <span className={`${styles.grazingRay} ${styles.grazingRayWide}`} />
        <span className={`${styles.grazingRay} ${styles.grazingRayFine}`} />
        <span className={styles.grazingSource} />
      </div>
    </FooterStudyFrame>
  );
}
