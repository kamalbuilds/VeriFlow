import React from "react";
import styles from "./index.module.css";

const Menus = ({ list, handleSelectMenuItem }) => {
  return (
    <div className={styles["container"]}>
      {list.map((item, i) => (
        <div
          key={i}
          className={styles["option"]}
          onClick={
            handleSelectMenuItem
              ? () => {
                  handleSelectMenuItem(item, i);
                }
              : () => {}
          }
        >
          {item.label && <p>{item.label}</p>}
          {!item.icon && item && typeof item !== "object" && <p>{item}</p>}
        </div>
      ))}
    </div>
  );
};

export default Menus;
