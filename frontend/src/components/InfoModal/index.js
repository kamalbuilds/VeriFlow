import Button from "@/reusables/Button";
import styles from "./index.module.css";
import Modal from "@/reusables/Modal";
import { useUser } from "@/context/userContext";
import { useMiner } from "@/context/minerContext";

export default function InfoModal({ isOpen, handleClose, isSubnet }) {
  const { user } = useUser();
  const { subnets } = useMiner();
  const subnet = {
    subnetAddress: "0x1dB005683012BfEa84c54e2cc5616b89ead5b5fE",
    route: "0x52b832b3b44394c51297aea8f6dda56aae677eab",
    minActivationCollateral: 100000,
    minValidators: 1,
    bottomUpCheckPeriod: 2,
    activeValidatorsLimit: 5,
    majorityPercentage: 60,
    consensus: "fendermint",
    powerScale: 1,
    permissionMode: "collateral",
    supplySource: "CUSDT",
    subnetID: "314159",
  };
  const { minerDetails } = user;

  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <div className={styles.container}>
        <div className={styles.content}>
          {!isSubnet && (
            <div className={styles.miner}>
              <h1>Miner</h1>
              <div className={styles.body}>
                {Object.keys(minerDetails).map((key) => (
                  <div className={styles.row} key={key}>
                    <p>
                      <b>{key}</b>
                    </p>
                    <p>{minerDetails[key].toString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.subnet}>
            <h1>Subnet</h1>
            <div className={styles.body}>
              {Object.keys(subnet).map((key) => (
                <div className={styles.row} key={key}>
                  <p>
                    <b>{key}</b>
                  </p>
                  <p>{subnet[key]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button
          label="Close"
          variant="secondary"
          onClick={handleClose}
          size="medium"
        />
      </div>
    </Modal>
  );
}
