import { useState } from "react";
import styles from "./index.module.css";
import Modal from "@/reusables/Modal";
import TextField from "@/reusables/TextField";
import Button from "@/reusables/Button";
import { useUser } from "@/context/userContext";
import toast from "react-hot-toast";

export default function SubnetModal({ openModal, setOpenModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minStake: "",
  });
  
  const { user } = useUser();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateSubnet = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement subnet creation functionality
      toast.success("Subnet creation coming soon!");
      setOpenModal(false);
      setFormData({ name: "", description: "", minStake: "" });
    } catch (error) {
      toast.error("Failed to create subnet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
      <div className={styles.container}>
        <h2 className={styles.title}>Create AI Subnet</h2>
        <p className={styles.description}>
          Create a specialized subnet for AI compute and data processing
        </p>
        
        <div className={styles.form}>
          <TextField
            label="Subnet Name"
            placeholder="Enter subnet name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
          
          <TextField
            label="Description"
            placeholder="Describe your subnet's purpose"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
            multiline
          />
          
          <TextField
            label="Minimum Stake (USDFC)"
            placeholder="0"
            value={formData.minStake}
            onChange={(e) => handleInputChange("minStake", e.target.value)}
            type="number"
          />
        </div>
        
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => setOpenModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSubnet}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create Subnet
          </Button>
        </div>
      </div>
    </Modal>
  );
}
