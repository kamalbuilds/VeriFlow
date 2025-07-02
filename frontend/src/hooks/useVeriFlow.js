import { useReadContract, useWriteContract } from "wagmi";
import contractAddress from "@/constants/contractAddresses.json";
import abi from "@/constants/abi.json";
import { parseEther } from "viem";

const useVeriFlow = () => {
  const { writeContract } = useWriteContract();

  // List a new AI dataset for sale
  const listDataset = async (metadataUri, pricePerBatch, filecoinDealId = 0) => {
    try {
      const result = await writeContract({
        address: contractAddress.VeriFlowMarketplace,
        abi: abi.VeriFlowMarketplace,
        functionName: "listDataset",
        args: [metadataUri, parseEther(pricePerBatch.toString()), filecoinDealId],
      });
      return result;
    } catch (error) {
      console.error("Error listing dataset:", error);
      throw error;
    }
  };

  // Purchase access to an AI dataset
  const purchaseDataset = async (datasetId, batchCount) => {
    try {
      const result = await writeContract({
        address: contractAddress.VeriFlowMarketplace,
        abi: abi.VeriFlowMarketplace,
        functionName: "purchaseData",
        args: [datasetId, batchCount],
      });
      return result;
    } catch (error) {
      console.error("Error purchasing dataset:", error);
      throw error;
    }
  };

  // Stake as a data provider
  const stakeAsProvider = async (amount) => {
    try {
      const result = await writeContract({
        address: contractAddress.VeriFlowMarketplace,
        abi: abi.VeriFlowMarketplace,
        functionName: "stakeAsProvider",
        args: [parseEther(amount.toString())],
      });
      return result;
    } catch (error) {
      console.error("Error staking as provider:", error);
      throw error;
    }
  };

  // Read dataset information
  const { data: datasetCount } = useReadContract({
    address: contractAddress.VeriFlowMarketplace,
    abi: abi.VeriFlowMarketplace,
    functionName: "datasetCounter",
  });

  // Get dataset information
  const getDataset = (datasetId) => {
    return useReadContract({
      address: contractAddress.VeriFlowMarketplace,
      abi: abi.VeriFlowMarketplace,
      functionName: "getDataset",
      args: [datasetId],
    });
  };

  // Get provider stake amount requirement
  const { data: minStakeAmount } = useReadContract({
    address: contractAddress.VeriFlowMarketplace,
    abi: abi.VeriFlowMarketplace,
    functionName: "providerStakeAmount",
  });

  // Get provider's current stake
  const getProviderStake = (address) => {
    return useReadContract({
      address: contractAddress.VeriFlowMarketplace,
      abi: abi.VeriFlowMarketplace,
      functionName: "providerStakes",
      args: [address],
    });
  };

  return {
    // Write functions
    listDataset,
    purchaseDataset,
    stakeAsProvider,
    
    // Read functions and data
    datasetCount,
    getDataset,
    minStakeAmount,
    getProviderStake,
  };
};

export default useVeriFlow; 