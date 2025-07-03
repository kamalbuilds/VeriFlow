import { useState } from "react";
import styles from "./index.module.css";
import Modal from "@/reusables/Modal";
import TextField from "@/reusables/TextField";
import Button from "@/reusables/Button";
import { useUser } from "@/context/userContext";
import toast from "react-hot-toast";

export default function MinerModal({ open, setOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    minerId: "",
    location: "",
    pricePerGB: "",
    paymentToken: "USDFC",
  });
  
  const { user } = useUser();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegisterMiner = async () => {
    if (!formData.minerId || !formData.location || !formData.pricePerGB) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement miner registration functionality
      toast.success("Data provider registration coming soon!");
      setOpen(false);
      setFormData({
        minerId: "",
        location: "",
        pricePerGB: "",
        paymentToken: "USDFC",
      });
    } catch (error) {
      toast.error("Failed to register as data provider");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <div className={styles.container}>
        <h2 className={styles.title}>Register as Data Provider</h2>
        <p className={styles.description}>
          Join VeriFlow as a verified AI data provider and start earning from your datasets
        </p>
        
        <div className={styles.form}>
          <TextField
            label="Provider ID"
            placeholder="Enter your provider ID"
            value={formData.minerId}
            onChange={(e) => handleInputChange("minerId", e.target.value)}
            required
          />
          
          <TextField
            label="Location"
            placeholder="Enter your location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            required
          />
          
          <TextField
            label="Price per GB (USDFC)"
            placeholder="0.0"
            value={formData.pricePerGB}
            onChange={(e) => handleInputChange("pricePerGB", e.target.value)}
            type="number"
            step="0.01"
            required
          />
          
          <TextField
            label="Payment Token"
            value={formData.paymentToken}
            disabled
            readOnly
          />
        </div>
        
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegisterMiner}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Register Provider
          </Button>
        </div>
      </div>
    </Modal>
  );
}
