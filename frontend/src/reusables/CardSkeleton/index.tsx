import styles from "./index.module.css";

export default function CardSkeleton() {
  return (
    <div className={styles["skeleton"]}>
      <div className={styles["skeleton-text"]}>
        <h2 className={styles["skeleton-title"]}></h2>
        <p className={styles["skeleton-description"]}>
          <span></span>
          <span></span>
        </p>
        <div className={styles["skeleton-skills"]}></div>
        <button className={styles["skeleton-button"]}></button>
      </div>
    </div>
  );
}
