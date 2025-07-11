import dayjs from "dayjs";
import { FileText, Search, Upload } from "lucide-react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import { useSharedFiles } from "../../hooks/useSharedFiles";
import { useSignatureStore } from "../../store/signatureStore";
import styles from "./ListDocumentsPage.module.scss";

const ListDocumentsPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { sharedFiles } = useSharedFiles(context.msGraphClientFactory);
  const { setCurrentSignature } = useSignatureStore();
  const history = useHistory();

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleNextPage = (id: string, name: string, webUrl: string): void => {
    setCurrentSignature({
      id,
      name,
      webUrl,
      phases: [{ id: 1, signers: [{}] }],
      signStatus: {},
      signaturePositions: {},
      activeSignerIds: [],
    });

    history.push("/signature-assignment");
  };

  const filteredDocuments = sharedFiles.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <h2 className={styles.pageTitle}>List Dokumen</h2>
        <div className={styles.tabs}>
          <div className={styles.tabItem}>Siap Sign</div>
          <div className={`${styles.tabItem} ${styles.activeTab}`}>
            Dokumen Belum Selesai
          </div>
          <div className={styles.tabItem}>Dokumen Selesai</div>
          <div className={styles.tabItem}>Lainnya</div>
        </div>
      </div>

      {sharedFiles.length === 0 ? (
        <p>Tidak ada file atau masih memuat...</p>
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari Dokumen"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.documentTable}>
            <div className={styles.tableHeader}>
              <span>Judul</span>
              <span>Pemilik</span>
              <span>Tanggal</span>
              <span>Aksi</span>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className={styles.noData}>Dokumen tidak ditemukan.</div>
            ) : (
              filteredDocuments.map((doc, index) => (
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
                      {doc.lastModifiedBy.user.email.toLowerCase()}
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
                      {dayjs(doc.fileSystemInfo.createdDateTime).format(
                        "HH:mm"
                      )}
                    </div>
                  </div>
                  <div className={styles.dateCell}>
                    <button
                      onClick={() =>
                        handleNextPage(doc.id, doc.name, doc.webUrl)
                      }
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDocumentsPage;
