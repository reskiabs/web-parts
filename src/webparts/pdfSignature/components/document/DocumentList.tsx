import { FileText, Folder } from "lucide-react";
import * as React from "react";
import { ISharedFile } from "../../hooks/useSharedFiles";
import styles from "./DocumentList.module.scss";

interface DocumentListProps {
  sharedFiles: ISharedFile[];
  onPreview: (file: ISharedFile) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  sharedFiles,
  onPreview,
}) => {
  return (
    <div className={styles.documentList}>
      {sharedFiles.length === 0 ? (
        <p>Tidak ada file atau masih memuat...</p>
      ) : (
        <div className={styles.fileContainer}>
          {sharedFiles.map((file) => {
            const isPdf = file.name.toLowerCase().endsWith(".pdf");
            return (
              <div key={file.id} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  {isPdf ? <FileText size={20} /> : <Folder size={20} />}
                  <span className={styles.fileName}>{file.name}</span>
                </div>
                {isPdf && (
                  <button
                    className={styles.signButton}
                    onClick={() => onPreview(file)}
                  >
                    Tanda Tangani
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
