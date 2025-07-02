import Link from "next/link";
import styles from "./index.module.css";

export default function Actions({ actions }) {
  return (
    <div className={styles.container}>
      {actions.map((action, i) => (
        <div key={i} className={styles.action} onClick={action.onClick}>
          {action.onClick && <p>{action.label}</p>}
          {action.path && (
            <Link href={action.path} target="_blank">
              {action.label}
            </Link>
          )}
          {action.icon && <img src={action.icon} alt={action.label} />}
        </div>
      ))}
    </div>
  );
}
