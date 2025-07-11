import dayjs from "dayjs";
import { CircleCheck, FileText, Search, Signature, Upload } from "lucide-react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useSignatureStore } from "../../store/signatureStore";
import styles from "./HomePage.module.scss";

const HomePage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const history = useHistory();
  const { user } = useCurrentUser(context.msGraphClientFactory);
  const { signedDocuments } = useSignatureStore();

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleNext = (): void => {
    history.push("/list-documents");
  };

  const handleSignDocument = (docId: string): void => {
    history.push(`/signed-document/${docId}`);
  };

  // Filtered documents berdasarkan search
  const filteredDocuments = signedDocuments.filter((doc) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(lowerSearch) ||
      doc.sender_name?.toLowerCase().includes(lowerSearch) ||
      doc.sender_email?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className={styles.HomePage}>
      {/* Header Greeting */}
      <div className={styles.headerBox}>
        <div className={styles.leftSection}>
          <div className={styles.greetingText}>
            Halo, <span className={styles.userName}>{user?.displayName}</span>
          </div>
          <div className={styles.accountType}>Welcome to AkuSign</div>
        </div>

        <div className={styles.rightSection}>
          <button onClick={handleNext}>
            <Upload size={16} />
            Upload Dokumen
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.activeTab}`}>
          Siap Sign <span>{signedDocuments.length}</span>
        </button>
        <button className={styles.tab}>
          Belum Selesai <span>10</span>
        </button>
        <button className={styles.tab}>
          Selesai <span>{signedDocuments.length}</span>
        </button>
        <button className={styles.tab}>
          Lainnya <span>6</span>
        </button>
      </div>

      {/* Search & Table */}
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
            <span>Pengirim</span>
            <span>Kadaluarsa</span>
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
                    <div className={styles.docPages}>
                      {doc.phases.length} Fase
                    </div>
                  </div>
                </div>
                <div className={styles.senderCell}>
                  <strong>{doc.sender_name || "-"}</strong>
                  <div className={styles.email}>{doc.sender_email || "-"}</div>
                </div>
                <div className={styles.senderCell}>
                  <div>{dayjs(doc.expired_at).format("DD MMMM YYYY")}</div>
                  <div className={styles.email}>
                    Pk. {dayjs(doc.expired_at).format("HH:mm:ss")}
                  </div>
                </div>
                <div className={styles.dateCell}>
                  {doc.is_signed && doc.signed_by?.includes(user?.id || "") ? (
                    <div className={styles.signed}>
                      <CircleCheck size={16} />
                      Ditandatangani
                    </div>
                  ) : (
                    <button onClick={() => handleSignDocument(doc.id)}>
                      <Signature size={14} />
                      Tanda Tangani
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
