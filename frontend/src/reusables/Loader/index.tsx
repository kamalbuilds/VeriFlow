import styles from "./index.module.css";

export default function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <div></div>
      </div>
    </div>
  );
}
