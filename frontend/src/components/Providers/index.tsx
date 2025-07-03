"use client";

import merge from "lodash.merge";
import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider } from "wagmi";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import {
  filecoinCalibration,
  polygonMumbai,
  goerli,
  arbitrumGoerli,
  fantomTestnet,
  optimismGoerli,
  avalancheFuji,
  moonbaseAlpha,
  celoAlfajores,
  mantleTestnet,
} from "wagmi/chains";

import { UserProvider } from "@/context/userContext";
import { DealProvider } from "@/context/DealContext";
import { MinerProvider } from "@/context/minerContext";

const projectId = "7ab7ac25d652c1675ac0a89cf2042275";

const appName = "VeriFlow";

const wagmiConfig = getDefaultConfig({
  appName,
  projectId,
  chains: [filecoinCalibration],
  ssr: true,
});

// const customTheme = merge(lightTheme(), {
//   colors: {
//     accentColor: "#246cf9",
//     accentColorForeground: "#ffffff",
//     connectButtonText: "#ffffff",
//     connectButtonBackground: "#246cf9",
//   },
//   radii: {
//     actionButton: 12,
//   },
// });

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UserProvider>
            <DealProvider>
              <MinerProvider>{children}</MinerProvider>
            </DealProvider>
          </UserProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
