import { CircleCheck } from "lucide-react";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useHistory } from "react-router-dom";
import SignatureOverlay from "../../components/document/SignatureOverlay";
import { useSignatureStore } from "../../store/signatureStore";
import styles from "./DocumentSignerPage.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentSignerPage: React.FC = () => {
  const history = useHistory();
  const {
    phases,
    signStatus,
    setSignStatus,
    signaturePositions,
    setSignaturePosition,
    activeSignerIds,
    setActiveSignerIds,
    selectedDocument,
  } = useSignatureStore();

  const handlePreviousPage = (): void => history.goBack();

  const isPhaseCompleted = (phaseId: number): boolean => {
    const phase = phases.find((p) => p.id === phaseId);
    if (!phase) return false;
    return phase.signers.every((_, idx) => signStatus[`${phaseId}-${idx}`]);
  };

  const handleSign = (
    phaseId: number,
    signerIndex: number,
    signerId?: string
  ): void => {
    const key = `${phaseId}-${signerIndex}`;
    setSignStatus(key, true);

    if (signerId && !activeSignerIds.includes(signerId)) {
      setActiveSignerIds([...activeSignerIds, signerId]);
    }
  };

  const getUserNameById = (id: string): string => {
    for (const phase of phases) {
      const signer = phase.signers.find((s) => s.id === id);
      if (signer) return signer.name || "-";
    }
    return "-";
  };

  const handleSubmit = (): void => {
    useSignatureStore.getState().clearPhases();
    alert("Dokumen dikirim ke AkuSign!");
    history.push("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{selectedDocument?.name}</h1>
      {phases.map((phase, phaseIndex) => {
        const prevPhaseDone =
          phaseIndex === 0 || isPhaseCompleted(phases[phaseIndex - 1].id);
        const isDisabledPhase = !prevPhaseDone;

        return (
          <section
            className={`${styles.section} ${
              isDisabledPhase ? styles.disabledPhase : ""
            }`}
            key={phase.id}
          >
            <div className={styles.sectionHeader}>
              <div className={styles.headerSection}>
                <p className={styles.docTitle}>
                  Atur Tanda Tangan (Fase {phaseIndex + 1})
                </p>
                <p className={styles.docSubtitle}>
                  Atur tanda tangan untuk setiap penerima di fase ini
                </p>
              </div>
            </div>

            <div className={styles.card}>
              {phase.signers.map((signer, signerIndex) => {
                const key = `${phase.id}-${signerIndex}`;
                const isSigned = signStatus[key] === true;

                return (
                  <React.Fragment key={signerIndex}>
                    <div className={styles.signerRow}>
                      <div className={styles.leftLabel}>
                        <label>Penerima {signerIndex + 1}</label>
                      </div>

                      <div className={styles.rightInfo}>
                        <strong>{signer.name || "-"}</strong>
                        <p>{signer.email || "-"}</p>
                      </div>

                      <div className={styles.buttonInfo}>
                        <button
                          type="button"
                          className={
                            isSigned ? styles.disabledButton : styles.signButton
                          }
                          disabled={isDisabledPhase || isSigned}
                          onClick={() =>
                            handleSign(phase.id, signerIndex, signer.id)
                          }
                        >
                          {isSigned
                            ? "Tanda Tangan Selesai"
                            : "Atur Tanda Tangan"}
                        </button>
                        <CircleCheck
                          size={18}
                          color={isSigned ? "#28a745" : "#ccc"}
                        />
                      </div>
                    </div>

                    {signerIndex !== phase.signers.length - 1 && (
                      <div className={styles.divider} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className={styles.pdfContainer} style={{ position: "relative" }}>
        <Document file={selectedDocument?.webUrl}>
          <Page
            pageNumber={1}
            width={800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        <SignatureOverlay
          signedUserIds={activeSignerIds}
          getUserNameById={getUserNameById}
          signaturePositions={signaturePositions}
          setSignaturePosition={setSignaturePosition}
        />
      </div>

      <div className={styles.footer}>
        <button className={styles.backButton} onClick={handlePreviousPage}>
          Kembali
        </button>
        <button className={styles.nextButton} onClick={handleSubmit}>
          Kirim ke AkuSign
        </button>
      </div>
    </div>
  );
};

export default DocumentSignerPage;
