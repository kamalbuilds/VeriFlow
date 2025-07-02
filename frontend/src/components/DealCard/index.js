import { useState } from "react";
import styles from "./index.module.css";
import Image from "next/image";
import { formatFileSize, getFormattedDate } from "@/utils/helper";
import { useUser } from "@/hooks/useUser";
import Actions from "./Actions";
import { useDeals } from "@/context/DealContext";
import toast from "react-hot-toast";
import useVeriFlow from "@/hooks/useVeriFlow";
import { useRouter } from "next/navigation";

export default function DealCard({ deal, isChallenge = false }) {
  const [showActions, setShowActions] = useState(false);
  const { startTime, endTime, pieceCid, size, fileName, miner } = deal;
  const { user } = useUser();
  const { handleStatusChange } = useDeals();
  const router = useRouter();

  const actions =
    user.role === "user"
      ? isChallenge
        ? [
            {
              label: "Verify",
              onClick: () => {
                toast.error("Dataset verification in progress!");
              },
            },
          ]
        : [
            {
              label: "Challenge",
              icon: "/challenge.svg",
              onClick: async () => {
                toast.error("Challenge functionality coming soon!");
              },
            },
            {
              label: "View Dataset",
              path: "#",
            },
          ]
      : [
          {
            label: "View Dataset",
            onClick: () => {
              console.log("View Dataset");
            },
          },
        ];

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  const isActive = now >= start && now <= end;
  const isPending = now < start;
  const isExpired = now > end;

  const getStatusColor = () => {
    if (isPending) return "bg-yellow-100 text-yellow-800";
    if (isActive) return "bg-green-100 text-green-800";
    if (isExpired) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = () => {
    if (isPending) return "Pending";
    if (isActive) return "Active";
    if (isExpired) return "Expired";
    return "Unknown";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{fileName}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.info}>
          <p><strong>Miner:</strong> {miner}</p>
          <p><strong>Size:</strong> {formatFileSize(size)}</p>
          <p><strong>Start:</strong> {getFormattedDate(startTime)}</p>
          <p><strong>End:</strong> {getFormattedDate(endTime)}</p>
        </div>
        
        <div className={styles.actions}>
          <button
            onClick={() => setShowActions(!showActions)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Actions
          </button>
        </div>
      </div>

      {showActions && (
        <div className={styles.actionMenu}>
          <Actions actions={actions} />
        </div>
      )}
    </div>
  );
}
