import styles from "./index.module.css";
import Image from "next/image";
import Navigation from "./components/Navigation";
import WalletConnet from "./components/WalletConnect";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/logo.svg" alt="logo" width={49} height={47} />
      </div>
      <Navigation />
      <WalletConnet />
    </header>
  );
}

export default Header;
