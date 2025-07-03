import React, { useState } from "react";
import styles from "./index.module.css";
import textStyles from "@/styles/Typography.module.css";

const TextField = ({
  width = "100%",
  type,
  state = "enabled",
  leadingIcon,
  trailingIcon,
  label,
  supportingText,
  value,
  button,
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const labelClass =
    isFocused || value
      ? state == "error"
        ? `${textStyles["body-small"]} ${styles["label-focused"]} ${styles["error"]}`
        : `${textStyles["body-small"]} ${styles["label-focused"]} ${styles["focus"]}`
      : `${textStyles["body-large"]} ${styles["label"]} ${styles[state]}`;

  const supportingTextClass = `${textStyles["body-small"]} ${styles["supporting-text"]} ${styles[state]}`;

  const containerClass = isFocused
    ? state == "error"
      ? `${styles["container"]} ${styles["container-error"]}`
      : `${styles["container"]} ${styles["container-focus"]}`
    : `${styles["container"]} ${styles["container-" + state]}`;

  return (
    <div className={styles["text-field"]} style={{ width: width }}>
      <div className={styles["input-field"]}>
        <div className={containerClass}>
          <input
            className={
              state == "disabled"
                ? `${styles["input"]} ${styles[state]}`
                : `${styles["input"]} `
            }
            type={type}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            disabled={state == "disabled" ? true : false}
            autoComplete="off"
            spellCheck="false"
            {...otherProps}
          />
        </div>
        <p className={`${styles.label} ${isFocused ? styles.focused : ""}`}>
          {label}
        </p>
      </div>
      <p className={supportingTextClass}>{supportingText}</p>
    </div>
  );
};

export default TextField;
