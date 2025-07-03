import styles from "./index.module.css";
export default function Button({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
}
