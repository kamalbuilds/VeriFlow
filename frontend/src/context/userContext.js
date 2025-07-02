"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useAccount } from "wagmi";

const defaultUser = {
  address: "",
  chainId: 1,
  role: "user",
  roleChoose: false,
  isConnected: false,
  isRegistered: false,
  minerDetails: {
    minerId: "t017849",
    paymentReceiver: "0x9299eac94952235Ae86b94122D2f7c77F7F6Ad30",
    token: "0x4a8c75f0318C1D9Aeff3e9345f4BAcC78D6D6779",
    price: "10000",
    location: "asia",
    dealDuration: "10000000",
    retrievalProvided: true,
    verifiedDeal: true,
  },
};

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const { address, isConnected } = useAccount();

  const handleChangeRole = (role) => {
    setUser((prev) => ({ ...prev, role, roleChoose: true }));
  };

  const handleChangeUser = (key, value) => {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangeMinerDetails = (key, value) => {
    setUser((prev) => ({
      ...prev,
      minerDetails: {
        ...prev.minerDetails,
        [key]: value,
      },
    }));
  };

  useEffect(() => {
    if (isConnected) {
      setUser((prev) => ({ ...prev, address, isConnected }));
    } else {
      setUser(defaultUser);
    }
  }, [isConnected]);
  return (
    <UserContext.Provider
      value={{
        user,
        handleChangeRole,
        handleChangeUser,
        handleChangeMinerDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
