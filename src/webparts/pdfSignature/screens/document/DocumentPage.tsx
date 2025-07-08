import { CircleArrowLeft } from "lucide-react";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import UserSelector from "../../components/user/UserSelector";
import { useDocumentPage } from "../../hooks/useDocumentPage";
import styles from "./DocumentPage.module.scss";
import SignatureOverlay from "./SignatureOverlay";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const {
    users,
    loading,
    file,
    topRef,
    pageNumber,
    setPageNumber,
    isSign,
    signType,
    setSignType,
    selectedUserId,
    setSelectedUserId,
    selectedUserIds,
    signedUserIds,
    signaturePositions,
    setSignaturePositions,
    handleUserChange,
    handleNext,
    handleSign,
    handleSend,
    getUserNameById,
  } = useDocumentPage(context);

  if (loading) return <div className={styles.container}>Memuat file...</div>;
  if (!file)
    return (
      <div className={styles.container} ref={topRef}>
        <p>File dengan ID tidak ditemukan.</p>
      </div>
    );

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
          onChange={handleUserChange}
          isSign={isSign}
          signType={signType}
          setSignType={setSignType}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          onSign={handleSign}
        />
      </div>

      <div className={styles.pdfContainer}>
        <Document
          file={file.webUrl}
          onLoadSuccess={() => setPageNumber(1)}
          loading="Memuat PDF..."
          error="Gagal memuat PDF"
        >
          <Page
            pageNumber={pageNumber}
            width={800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        {signType === "signature" && (
          <SignatureOverlay
            signedUserIds={signedUserIds}
            signaturePositions={signaturePositions}
            setSignaturePositions={setSignaturePositions}
            getUserNameById={getUserNameById}
          />
        )}
      </div>

      <div className={styles.actionContainer}>
        <button
          className={`${styles.lanjutButton} ${
            selectedUserIds.length === 0
              ? styles.disabledButton
              : styles.enabledButton
          }`}
          disabled={selectedUserIds.length === 0}
          onClick={isSign ? handleSend : handleNext}
        >
          {isSign ? "Kirim ke AkuSign" : "Lanjutkan"}
        </button>
      </div>
    </div>
  );
};

export default DocumentPage;
