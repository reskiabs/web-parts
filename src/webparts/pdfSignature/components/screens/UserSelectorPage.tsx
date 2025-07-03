import * as React from "react";
import { useUsers } from "../../hooks/useUsers";
import { IPdfSignatureProps } from "../IPdfSignatureProps";
import styles from "../PdfSignature.module.scss";
import UserSelector from "../user/UserSelector";

const UserSelectorPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { users } = useUsers(context.msGraphClientFactory);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  return (
    <div className={styles.pdfSignature}>
      <UserSelector
        users={users}
        selectedUserId={selectedUserId}
        onChange={setSelectedUserId}
      />
    </div>
  );
};

export default UserSelectorPage;
