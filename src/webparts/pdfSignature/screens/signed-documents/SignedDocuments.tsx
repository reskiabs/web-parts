import { FileText, Filter, Search } from "lucide-react";
import * as React from "react";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import styles from "./SignedDocuments.module.scss";

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
];

const SignedDocuments: React.FC<IPdfSignatureProps> = ({ context }) => {
  return (
    <div className={styles.signedDocuments}>
      <h1 className={styles.headerTitle}>Dokumen</h1>

      {/* <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>Siap Sign</button>
        <button className={styles.tab}>Dokumen Belum Selesai</button>
        <button className={styles.tab}>Dokumen Selesai</button>
        <button className={styles.tab}>Lainnya</button>
      </div> */}

      <div className={styles.searchFilter}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input type="text" placeholder="Cari Dokumen" />
        </div>
        <button className={styles.filterButton}>
          <Filter size={16} /> Filter
        </button>
      </div>

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
  );
};

export default SignedDocuments;
