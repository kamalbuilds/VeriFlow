"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/context/userContext";
import MinerModal from "@/components/MinerModal";
import RoleModal from "@/components/RoleModal";
import styles from "./index.module.css";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const { user } = useUser();
  const { role, roleChoose } = user;

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <div className={styles.navigation}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={styles.navLink}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!roleChoose && (
        <button
          onClick={() => setOpenRole(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Choose Role
        </button>
      )}

      {role === "miner" && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Register as Provider
        </button>
      )}

      <MinerModal open={open} setOpen={setOpen} />
      <RoleModal openRole={openRole} setOpenRole={setOpenRole} />
    </div>
  );
}
