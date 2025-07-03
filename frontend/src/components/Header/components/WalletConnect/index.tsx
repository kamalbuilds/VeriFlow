"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../index.module.css";

// function WalletConnet() {
//   return (
//     <div className={styles["wallet-connet"]}>
//       <ConnectButton.Custom>
//         {({
//           account,
//           chain,
//           openAccountModal,
//           openChainModal,
//           openConnectModal,
//           mounted,
//         }) => {
//           const ready = mounted;
//           const connected = ready && account && chain;

//           return (
//             <div
//               {...(!ready && {
//                 "aria-hidden": true,
//                 style: {
//                   opacity: 0,
//                   pointerEvents: "none",
//                   userSelect: "none",
//                 },
//               })}
//             >
//               {(() => {
//                 if (!connected) {
//                   return (
//                     <button
//                       onClick={openConnectModal}
//                       type="button"
//                       className={styles.btn}
//                     >
//                       Login/Sign Up
//                     </button>
//                   );
//                 }

//                 if (chain.unsupported) {
//                   return (
//                     <button
//                       onClick={openChainModal}
//                       type="button"
//                       className={styles["wrong-network-btn"]}
//                     >
//                       Wrong network
//                     </button>
//                   );
//                 }

//                 return (
//                   <div style={{ display: "flex", gap: 12 }}>
//                     <button
//                       onClick={openChainModal}
//                       style={{ display: "flex", alignItems: "center" }}
//                       type="button"
//                       className={styles["chain-btn"]}
//                     >
//                       {chain.hasIcon && (
//                         <div
//                           style={{
//                             background: chain.iconBackground,
//                             width: 25,
//                             height: 25,
//                             borderRadius: 999,
//                             overflow: "hidden",
//                             marginRight: 4,
//                           }}
//                         >
//                           {chain.iconUrl && (
//                             <img
//                               alt={chain.name ?? "Chain icon"}
//                               src={chain.iconUrl}
//                               style={{ width: 25, height: 25 }}
//                             />
//                           )}
//                         </div>
//                       )}
//                       {!chain.hasIcon && chain.name}
//                     </button>

//                     <button
//                       onClick={openAccountModal}
//                       type="button"
//                       className={styles["account-btn"]}
//                     >
//                       {account.displayName}
//                     </button>
//                   </div>
//                 );
//               })()}
//             </div>
//           );
//         }}
//       </ConnectButton.Custom>
//     </div>
//   );
// }

function WalletConnet() {
  return (
    <div className={styles["wallet-connect"]}>
      <ConnectButton label="LOGIN/SIGN UP" />
    </div>
  );
}

export default WalletConnet;
