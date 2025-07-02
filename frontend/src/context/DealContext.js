"use client";
import { useState, createContext, useContext } from "react";

const defaultDeals = [
  {
    fileName: "high-fi.png",
    size: "83473847",
    miner: "t017840",
    pieceCid: "bafybeib3e32n2isls5yertlfcmsaqxpisryunis3rknxca26n4jcqdpymm",
    startTime: "2024-06-01T00:00:00.000Z",
    endTime: "2024-09-05T00:00:00.000Z",
    status: "active",
  },
];

const DealContext = createContext(null);

export const useDeals = () => {
  const context = useContext(DealContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const DealProvider = ({ children }) => {
  const [deals, setDeals] = useState(defaultDeals);

  const handleAddDeal = (deal) => {
    setDeals((prev) => [...prev, deal]);
  };

  const filterDeals = (status) => {
    return deals.filter((deal) => deal.status === status);
  };

  const handleStatusChange = (fileName, status) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.fileName === fileName ? { ...deal, status } : deal
      )
    );
  };

  return (
    <DealContext.Provider
      value={{
        deals,
        handleAddDeal,
        filterDeals,
        handleStatusChange,
      }}
    >
      {children}
    </DealContext.Provider>
  );
};
