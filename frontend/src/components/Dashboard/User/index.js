import DashboardNav from "@/reusables/DashboardNav";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Active, Pending, Challenged } from "../components";
import { Store } from "./components";
import { useReadContract } from "wagmi";
import { contractAddress, abi } from "../../../../constants";
import { useUser } from "@/context/userContext";
import { useDeals } from "@/context/DealContext";
export default function User() {
  const list = ["pending", "active", "challenged", "store"];
  const [selected, setSelected] = useState("store");
  const { user } = useUser();
  const handleSelectMenuItem = (item) => {
    setSelected(item);
  };

  const { filterDeals } = useDeals();
  const activeDeals = filterDeals("active");
  const pendingDeals = filterDeals("pending");
  const challengedDeals = filterDeals("challenged");
  return (
    <div className={styles.container}>
      <DashboardNav
        list={list}
        handleSelectMenuItem={handleSelectMenuItem}
        selected={selected}
      />
      <div className={styles["selected-container"]}>
        {selected === "active" && (
          <Active deals={activeDeals} message={"No Active Deals"} />
        )}
        {selected === "pending" && (
          <Active deals={pendingDeals} message={"No Pending Deals!"} />
        )}
        {selected === "challenged" && (
          <Challenged
            deals={challengedDeals}
            message={"No Chanllenged Deals!"}
          />
        )}
        {selected === "store" && <Store />}
      </div>
    </div>
  );
}
