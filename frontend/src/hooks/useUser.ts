import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const defaultUser = {
  address: "",
  chainId: 1,
  role: "user",
  roleChoose: false,
  isConnected: false,
  minerDetails: {
    token: "",
    price: "",
    location: "",
    dealDuration: "",
    retrievalProvided: false,
  },
};

export function useUser() {
  const [user, setUser] = useState(defaultUser);
  const { address, isConnected } = useAccount();

  const changeRole = (role) => {
    setUser((prev) => ({ ...prev, role, roleChoose: true }));
  };

  useEffect(() => {
    if (isConnected) {
      setUser((prev) => ({ ...prev, address, isConnected }));
    } else {
      setUser(defaultUser);
    }
  }, [isConnected]);

  return { user, changeRole };
}
