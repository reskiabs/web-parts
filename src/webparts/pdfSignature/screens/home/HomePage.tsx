import { FileText, Search, SlidersHorizontal } from "lucide-react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import styles from "./HomePage.module.scss";

const documents = [
  {
    title: "Surat Perjanjian Kerjasama",
    pages: 4,
    sender: "Bagus Dwi",
    email: "bagus.dwi@email.com",
    updated: "03 Jan 2025",
    expired: "05 Jan 2025",
    time: "Pk. 09:10 WIB",
  },
  {
    title: "Invoice Pembelian Meja",
    pages: 2,
    sender: "Setiawati",
    email: "setiawati@email.com",
    updated: "25 Des 2024",
    expired: "02 Jan 2025",
    time: "Pk. 09:10 WIB",
  },
  {
    title: "Invoice Pengadaan Jasa",
    pages: 2,
    sender: "Dwi Rahmawati",
    email: "dwi.rahmawati@email.com",
    updated: "21 Des 2024",
    expired: "21 Des 2024",
    time: "Pk. 09:10 WIB",
  },
  {
    title: "Quotation Pengadaan Jaringan",
    pages: 4,
    sender: "Dwi Rahmawati",
    email: "namapengirim@email.com",
    updated: "18 Des 2024",
    expired: "19 Des 2024",
    time: "Pk. 09:10 WIB",
  },
  {
    title: "Invoice Pembayaran Jasa",
    pages: 3,
    sender: "Antoni",
    email: "antoni@email.com",
    updated: "15 Des 2024",
    expired: "16 Des 2024",
    time: "Pk. 09:10 WIB",
  },
  {
    title: "Surat Kontrak Perjanjian",
    pages: 4,
    sender: "Devin Iskandar",
    email: "devin.iskandar@email.com",
    updated: "15 Des 2024",
    expired: "15 Des 2024",
    time: "Pk. 09:10 WIB",
  },
  {
    title: "Surat Perjanjian Kerjasama",
    pages: 4,
    sender: "Bagus Dwi",
    email: "bagus.dwi@email.com",
    updated: "03 Jan 2025",
    expired: "05 Jan 2025",
    time: "Pk. 09:10 WIB",
  },
  {
    title: "Invoice Pembelian Meja",
    pages: 2,
    sender: "Setiawati",
    email: "setiawati@email.com",
    updated: "25 Des 2024",
    expired: "02 Jan 2025",
    time: "Pk. 09:10 WIB",
  },
];

const HomePage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const history = useHistory();
  const { user } = useCurrentUser(context.msGraphClientFactory);

  const handleNext = (): void => {
    history.push("/list-documents");
  };

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
          <button onClick={handleNext}>Tanda Tangani Dokumen</button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={styles.tab}>
          Siap Sign <span>12</span>
        </button>
        <button className={`${styles.tab} ${styles.activeTab}`}>
          Belum Selesai <span>10</span>
        </button>
        <button className={styles.tab}>
          Selesai <span>10</span>
        </button>
        <button className={styles.tab}>
          Lainnya <span>6</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className={styles.tableContainer}>
        <div className={styles.searchFilter}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input type="text" placeholder="Cari Dokumen" />
          </div>
          <button className={styles.filterButton}>
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        {/* Document Table */}
        <div className={styles.documentTable}>
          <div className={styles.tableHeader}>
            <span>Judul</span>
            <span>Pengirim</span>
            <span>Diperbarui</span>
            <span>Kadaluarsa</span>
          </div>

          {documents.map((doc, index) => (
            <div className={styles.tableRow} key={index}>
              <div className={styles.titleCell}>
                <FileText size={20} />
                <div>
                  <div className={styles.docTitle}>{doc.title}</div>
                  <div className={styles.docPages}>{doc.pages} Halaman</div>
                </div>
              </div>
              <div className={styles.senderCell}>
                <div>{doc.sender}</div>
                <div className={styles.email}>{doc.email}</div>
              </div>
              <div className={styles.dateCell}>
                <div>{doc.updated}</div>
                <div>{doc.time}</div>
              </div>
              <div className={styles.dateCell}>
                <div>{doc.expired}</div>
                <div>Pk. 12:00 WIB</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
