import SubnetCard from "@/components/SubnetCard";
import styles from "./index.module.css";
import SubnetModal from "@/components/SubnetModal";
import Button from "@/reusables/Button";
import { useState } from "react";
import useDealClient from "@/hooks/useDealClient";
import { useMiner } from "@/context/minerContext";
import InfoModal from "@/components/InfoModal";

const dummyMiner = {
  miner: "t3xv7b7v6",
  pieceCid: "bafykbzaced6w",
  time: 3049483,
  price: 12,
};

export default function Subnet() {
  const [isOpen, setIsOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [file, setFile] = useState(null);
  const { makeDealProposal } = useDealClient();
  const { subnets } = useMiner();

  const handleOpenSubnetModal = () => {
    setIsOpen(true);
  };
  const handleOpenInfoModal = () => {
    setOpenInfo(true);
  };
  return (
    <div className={styles.container}>
      <div className={styles.btn}>
        <Button
          label="CREATE SUBNET"
          variant="primary"
          size="large"
          onClick={handleOpenSubnetModal}
        />
      </div>

      <div className={styles.subnets}>
        {subnets.map((subnet) => (
          <SubnetCard
            subnet={subnet}
            key={subnet.subnetID}
            handleOpenInfoModal={handleOpenInfoModal}
          />
        ))}
      </div>

      <SubnetModal
        isOpen={isOpen}
        handleClose={() => {
          setIsOpen(false);
        }}
      />
      <InfoModal
        isOpen={openInfo}
        handleClose={() => setOpenInfo(false)}
        isSubnet
      />
    </div>
  );
}
