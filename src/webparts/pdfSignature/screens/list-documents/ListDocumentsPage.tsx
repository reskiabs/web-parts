import dayjs from "dayjs";
import { FileText, Signature, SlidersHorizontal } from "lucide-react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import { useSharedFiles } from "../../hooks/useSharedFiles";
import { useSignatureStore } from "../../store/signatureStore";
import styles from "./ListDocumentsPage.module.scss";

const ListDocumentsPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { sharedFiles } = useSharedFiles(context.msGraphClientFactory);
  const { setSelectedDocument } = useSignatureStore();
  const history = useHistory();

  const handleNextPage = (name: string, webUrl: string): void => {
    setSelectedDocument({ name, webUrl });
    history.push("/signature-assignment");
  };

  return (
    <div className={styles.container}>
      {sharedFiles.length === 0 ? (
        <p>Tidak ada file atau masih memuat...</p>
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.searchFilter}>
            <div className={styles.headerTitle}>
              <p className={styles.docCount}>{sharedFiles.length} Dokumen</p>
              <p className={styles.docSubtitle}>
                Dokumen yang siap untuk tanda tangani
              </p>
            </div>
            <button className={styles.filterButton}>
              <SlidersHorizontal size={14} /> Filter
            </button>
          </div>
          <div className={styles.documentTable}>
            <div className={styles.tableHeader}>
              <span>Judul</span>
              <span>Pemilik</span>
              <span>Tanggal</span>
              <span>Aksi</span>
            </div>

            {sharedFiles.map((doc, index) => (
              <div className={styles.tableRow} key={index}>
                <div className={styles.titleCell}>
                  <FileText size={20} />
                  <div>
                    <div className={styles.docTitle}>{doc.name}</div>
                    <div className={styles.docPages}>{doc.pages} Halaman</div>
                  </div>
                </div>
                <div className={styles.senderCell}>
                  <div>{doc.lastModifiedBy.user.displayName}</div>
                  <div className={styles.email}>
                    {doc.lastModifiedBy.user.email.toLocaleLowerCase()}
                  </div>
                </div>
                <div className={styles.dateCell}>
                  <div>
                    {dayjs(doc.fileSystemInfo.createdDateTime).format(
                      "DD MMM YYYY"
                    )}
                  </div>
                  <div className={styles.email}>
                    Pk.{" "}
                    {dayjs(doc.fileSystemInfo.createdDateTime).format("HH:mm")}
                  </div>
                </div>
                <div className={styles.dateCell}>
                  <button
                    className={styles.signButton}
                    onClick={() => handleNextPage(doc.name, doc.webUrl)}
                  >
                    <Signature size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDocumentsPage;
