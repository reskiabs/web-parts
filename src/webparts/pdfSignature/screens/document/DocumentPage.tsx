import { CircleArrowLeft } from "lucide-react";
import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import UserSelector from "../../components/user/UserSelector";
import { ISharedFile, useSharedFiles } from "../../hooks/useSharedFiles";
import { useUsers } from "../../hooks/useUsers";
import styles from "./DocumentPage.module.scss";

interface RouteParams {
  fileId: string;
}

interface LocationState {
  file?: ISharedFile;
}

const DocumentPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { fileId } = useParams<RouteParams>();
  const location = useLocation<LocationState>();
  const { loading, getFileById } = useSharedFiles(context.msGraphClientFactory);
  const { users } = useUsers(context.msGraphClientFactory);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
  const [isSign, setIsSign] = React.useState<boolean>(false);

  const handleSign = (): void => {
    setIsSign(true);
  };

  const fileFromState = location.state?.file;
  const fileFromId = getFileById(fileId);

  const file = fileFromState || fileFromId;

  if (loading) {
    return <div className={styles.container}>Memuat file...</div>;
  }

  if (!file) {
    return (
      <div className={styles.container}>
        <p>File dengan ID {fileId} tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CircleArrowLeft size={24} onClick={() => window.history.back()} />
        <h2 className={styles.fileName}>{file.name}</h2>
      </div>
      <div className={styles.signer}>
        <UserSelector
          users={users}
          selectedUserIds={selectedUserIds}
          onChange={setSelectedUserIds}
          isSign={isSign}
        />
      </div>

      <iframe
        src={file.webUrl}
        title={file.name}
        width="100%"
        height="600px"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      />

      <div className={styles.actionContainer} onClick={handleSign}>
        <button className={styles.lanjutButton}>
          {isSign ? "Kirim ke AkuSign" : "Lanjutkan"}
        </button>
      </div>
    </div>
  );
};

export default DocumentPage;
