import styles from "./index.module.css";
export default function DashboardNav({ list, handleSelectMenuItem, selected }) {
  return (
    <div className={styles.container}>
      {list.map((item, i) => (
        <div
          className={styles["option-wrapper"]}
          key={i}
          onClick={
            handleSelectMenuItem
              ? () => {
                  handleSelectMenuItem(item);
                }
              : () => {}
          }
        >
          <div
            className={`${styles.option} ${
              selected === item ? styles.selected : ""
            }`}
          >
            {item.label && <p>{item.label}</p>}
            {typeof item !== "object" && <p>{item}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
