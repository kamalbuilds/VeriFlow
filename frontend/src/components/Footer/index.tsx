import styles from "./index.module.css";
import Navigation from "../Header/components/Navigation";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.contact}>
          <p className={styles.email}>contact@veriflow.ai</p>
          <div className={styles.socialLinks}>
            <a
              href="https://twitter.com/veriflow"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src="/Facebook.svg" alt="Twitter" />
            </a>
            <a
              href="https://facebook.com/veriflow"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src="/Instagram.svg" alt="Facebook" />
            </a>
            <a
              href="https://instagram.com/veriflow"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src="/Linkedin.svg" alt="Instagram" />
            </a>
          </div>
        </div>
        <div className={styles.companyInfo}>
          <p className={styles.copyright}>Copyright © 2024 • VeriFlow AI Data Marketplace.</p>
        </div>
      </div>
    </footer>
  );
}
