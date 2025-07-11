import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useHistory, useParams } from "react-router-dom";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useSignatureStore } from "../../store/signatureStore";
import SignatureOverlay from "../document-signer/SignatureOverlay";
import ModalOtp from "./ModalOtp";
import styles from "./SignedDocumentPage.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const SignedDocumentsPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { signedDocuments, markDocumentAsSigned } = useSignatureStore();
  const { user } = useCurrentUser(context.msGraphClientFactory);

  const document = signedDocuments.find((doc) => doc.id === id);
  const userId = user?.id;
  const signaturePosition = document?.signaturePositions?.[userId || ""];

  const [isSigned, setIsSigned] = React.useState(false);
  const [showOtpModal, setShowOtpModal] = React.useState(false);

  const handleBack = (): void => {
    history.goBack();
  };

  const handleSign = (): void => {
    setIsSigned(true);
  };

  const handleSubmit = (): void => {
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (otpValue: string): void => {
    if (!document || !userId) return;

    markDocumentAsSigned(document.id, userId);
    setShowOtpModal(false);
    history.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.pdfContainer} style={{ position: "relative" }}>
        {document ? (
          <>
            <Document file={document.webUrl}>
              <Page
                pageNumber={1}
                width={800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {isSigned && signaturePosition && (
              <SignatureOverlay
                signedUserIds={[userId!]}
                getUserText={() => ({
                  label: "Dokumen ini telah ditandatangani oleh",
                  name: user?.displayName || "-",
                })}
                signaturePositions={{ [userId!]: signaturePosition }}
                setSignaturePosition={() => {}}
              />
            )}
          </>
        ) : (
          <div className={styles.noData}>Dokumen tidak ditemukan.</div>
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.backButton} onClick={handleBack}>
          Batal
        </button>
        <button
          className={styles.nextButton}
          onClick={isSigned ? handleSubmit : handleSign}
        >
          {isSigned ? "Selesai" : "Tanda Tangani"}
        </button>
      </div>
      {showOtpModal && (
        <ModalOtp
          email={user?.mail || user?.displayName || "-"}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
        />
      )}
    </div>
  );
};

export default SignedDocumentsPage;
