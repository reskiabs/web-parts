import { X } from "lucide-react";
import React from "react";
import styles from "./SignatureAssignment.module.scss";

const SignatureAssignment: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Invoice Pemesanan Lampu oleh <br />
        <span>PT. Aneka Jaya Abadi untuk Ruangan Megasa</span>
      </h1>

      <section className={styles.section}>
        <div className={styles.headerSection}>
          <p className={styles.docTitle}>Pemilik Dokumen</p>
          <p className={styles.docSubtitle}>
            Dokumen yang siap untuk tanda tangani
          </p>
        </div>
        <div className={styles.card}>
          <div className={styles.signerRow}>
            <div className={styles.leftLabel}>
              <label>Penandatangan</label>
            </div>
            <div className={styles.rightInfo}>
              <strong>Reski Abbas</strong>
              <p>reski.abbas@idas.id</p>
            </div>
          </div>
        </div>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" defaultChecked />
          Saya ingin menandatangani dokumen
        </label>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerSection}>
            <p className={styles.docTitle}>Penandatangan</p>
            <p className={styles.docSubtitle}>
              Data Persetujuan diperlukan jika dokumen yang diunggah membutuhkan
              persetujuan
            </p>
          </div>
          <button className={styles.addButton}>+ PENERIMA BARU</button>
        </div>
        <div className={styles.card}>
          <div className={styles.signerRow}>
            <div className={styles.leftLabel}>
              <label>Penandatangan</label>
            </div>
            <div className={styles.rightInfo}>
              <strong>Reski Abbas</strong>
              <p>reski.abbas@idas.id</p>
            </div>
            <button className={styles.removeButton}>
              <X size={16} />
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.signerRow}>
            <div className={styles.leftLabel}>
              <label>Penandatangan</label>
            </div>
            <div className={styles.rightInfo}>
              <strong>Niko Indrawan</strong>
              <p>niko.indrawan@email.com</p>
            </div>
            <button className={styles.removeButton}>
              <X size={16} />
            </button>
          </div>
        </div>
      </section>

      <button className={styles.addPhaseButton}>
        Tambah Fase Penandatangan
      </button>

      <div className={styles.footer}>
        <button className={styles.backButton}>Kembali</button>
        <button className={styles.nextButton}>Lanjut</button>
      </div>
    </div>
  );
};

export default SignatureAssignment;
