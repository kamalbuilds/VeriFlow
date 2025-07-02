import styles from "./index.module.css";
export default function Modal({ open, onClose, children }) {
  return (
    <div
      className={`${styles.modal} ${
        open ? styles["display-block"] : styles["display-none"]
      }`}
    >
      <div className={styles["modal-main"]}>{children}</div>
    </div>
  );
}
