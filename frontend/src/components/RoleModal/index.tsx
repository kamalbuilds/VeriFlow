import styles from "./index.module.css";
import Modal from "@/reusables/Modal";
import Image from "next/image";
import { useUser } from "@/context/userContext";

export default function RoleModal() {
  const { user, handleChangeRole } = useUser();
  return (
    <Modal open={!user.roleChoose && user.isConnected}>
      <div className={styles.modal}>
        <h2>Who Are You ?</h2>
        <div className={styles["role-container"]}>
          <button
            className={`${styles["role-btn"]} ${
              user.role === "user" ? styles.selected : ""
            }`}
            onClick={() => {
              handleChangeRole("user");
            }}
          >
            <Image src={"user-large.svg"} alt="user" width={188} height={225} />
            <span>User</span>
          </button>
          <button
            className={`${styles["role-btn"]} ${
              user.role === "miner" ? styles.selected : ""
            }`}
            onClick={() => {
              handleChangeRole("miner");
            }}
          >
            <Image
              src={"miner-large.svg"}
              alt="miner"
              width={200}
              height={225}
            />
            <span>Miner</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
