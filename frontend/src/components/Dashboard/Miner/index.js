import DashboardNav from "@/reusables/DashboardNav";
import { useState, useEffect } from "react";
import { Active, Pending, Challenged } from "../components";
import { Subnet } from "./components";
import styles from "./index.module.css";
import { useDeals } from "@/context/DealContext";
export default function Miner() {
  const list = ["pending", "active", "challenged", "subnet"];
  const [selected, setSelected] = useState("active");
  const handleSelectMenuItem = (item) => {
    setSelected(item);
  };
  // const minerDetails = {
  //   miner: minerData[0],
  //   paymentReciever: minerData[1],
  //   token: minerData[2],
  //   price: minerData[3],
  //   location: minerData[4],
  //   dealDuration: minerData[5],
  //   verifiedDeal: minerData[6],
  //   retrievalProvided: minerData[7],
  // };
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
          <Active deals={[]} message={"No Active Deals"} />
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
        {selected === "subnet" && <Subnet />}
      </div>
    </div>
  );
}
