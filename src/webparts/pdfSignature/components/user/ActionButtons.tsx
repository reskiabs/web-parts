import { FilePenLine, Signature } from "lucide-react";
import React from "react";
import styles from "./UserSelector.module.scss";

interface ActionButtonsProps {
  signType: "signature" | "initials" | undefined;
  selectedUserId: string | undefined;
  handleSignAction: (type: "signature" | "initials") => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  signType,
  selectedUserId,
  handleSignAction,
}) => (
  <div className={styles.actionGroup}>
    <button
      disabled={!selectedUserId}
      className={`${styles.actionButton} ${
        signType === "signature" ? styles.activeAction : ""
      } ${!selectedUserId ? styles.disabledAction : ""}`}
      onClick={() => handleSignAction("signature")}
    >
      <Signature size={18} />
      Tanda Tangani
    </button>

    <button
      disabled={!selectedUserId}
      className={`${styles.actionButton} ${
        signType === "initials" ? styles.activeAction : ""
      } ${!selectedUserId ? styles.disabledAction : ""}`}
      onClick={() => handleSignAction("initials")}
    >
      <FilePenLine size={18} />
      Paraf
    </button>
  </div>
);

export default ActionButtons;
