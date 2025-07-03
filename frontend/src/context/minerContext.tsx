"use client";
import { useState, createContext, useContext } from "react";

const defaultSubnet = [];

const MinerContext = createContext(null);

export const useMiner = () => {
  const context = useContext(MinerContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const MinerProvider = ({ children }) => {
  const [subnets, setSubnets] = useState(defaultSubnet);

  const handleAddSubnet = (deal) => {
    setSubnets((prev) => [...prev, deal]);
  };

  const handleDeleteSubnet = (subnetID) => {
    setSubnets((prev) => prev.filter((subnet) => subnet.subnetID !== subnetID));
  };
  return (
    <MinerContext.Provider
      value={{
        subnets,
        handleAddSubnet,
        handleDeleteSubnet,
      }}
    >
      {children}
    </MinerContext.Provider>
  );
};
