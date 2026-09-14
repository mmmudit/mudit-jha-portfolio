import { FooterStudyFrame } from "./footer-study-frame";
import { OrganicStars } from "./organic-stars";
import styles from "./solar-footer.module.css";

export function CoronaRays() {
  return (
    <FooterStudyFrame label="Coronal sun glare with fine solar rays">
      <OrganicStars tone="corona" />
      <div className={styles.coronaGlare} aria-hidden="true">
        <span className={styles.coronaHalo} />
        <span className={styles.coronaCross} />
        <span className={`${styles.coronaRay} ${styles.coronaRayLeft}`} />
        <span className={`${styles.coronaRay} ${styles.coronaRayRight}`} />
        <span className={styles.coronaCore} />
      </div>
    </FooterStudyFrame>
  );
}
