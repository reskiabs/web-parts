import { X } from "lucide-react";
import React from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import { IUser, useUsers } from "../../hooks/useUsers";
import { useSignatureStore } from "../../store/signatureStore";
import styles from "./SignatureAssignment.module.scss";

interface UserOption {
  value: string;
  label: string;
  user: IUser;
}

const SignatureAssignment: React.FC<IPdfSignatureProps> = ({ context }) => {
  const history = useHistory();
  const { users, loading } = useUsers(context.msGraphClientFactory);

  const { phases, setPhases, selectedDocument } = useSignatureStore();

  React.useEffect(() => {
    if (phases.length === 0) {
      setPhases([{ id: 1, signers: [{}] }]);
    }
  }, [phases, setPhases]);

  const handleAddPhase = (): void => {
    const newPhaseId = phases.length + 1;
    setPhases([...phases, { id: newPhaseId, signers: [{}] }]);
  };

  const handleAddSigner = (phaseId: number): void => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? { ...phase, signers: [...phase.signers, {}] }
          : phase
      )
    );
  };

  const handleRemoveSigner = (phaseId: number, signerIndex: number): void => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              signers: phase.signers.filter((_, idx) => idx !== signerIndex),
            }
          : phase
      )
    );
  };

  const handleSelectUser = (
    phaseId: number,
    signerIndex: number,
    user: IUser
  ): void => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              signers: phase.signers.map((signer, idx) =>
                idx === signerIndex
                  ? {
                      id: user.id,
                      name: user.displayName,
                      email: user.mail,
                      selected: true,
                    }
                  : signer
              ),
            }
          : phase
      )
    );
  };

  const handlePreviousPage = (): void => history.goBack();
  const handleNextPage = (): void => history.push("/document-signer");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{selectedDocument?.name}</h1>

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
      </section>

      {phases.map((phase) => (
        <section className={styles.section} key={phase.id}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerSection}>
              <p className={styles.docTitle}>
                Penandatangan {phases.length > 1 ? `(Fase ${phase.id})` : ""}
              </p>
              <p className={styles.docSubtitle}>
                Data Persetujuan diperlukan jika dokumen yang diunggah
                membutuhkan persetujuan
              </p>
            </div>
            <button
              className={styles.addButton}
              onClick={() => handleAddSigner(phase.id)}
            >
              + PENERIMA BARU
            </button>
          </div>
          <div className={styles.card}>
            {phase.signers.map((signer, signerIndex) => (
              <React.Fragment key={signerIndex}>
                <div className={styles.signerRow}>
                  <div className={styles.leftLabel}>
                    <label>Penandatangan</label>
                  </div>
                  <div className={styles.rightInfo}>
                    {!signer.selected ? (
                      <Select<UserOption, false>
                        className={styles.userSelect}
                        classNamePrefix="react-select"
                        isLoading={loading}
                        options={users.map((user) => ({
                          value: user.id,
                          label: `${user.displayName} (${user.mail})`,
                          user,
                        }))}
                        placeholder="Pilih Penandatangan"
                        onChange={(selectedOption: UserOption | null) => {
                          if (selectedOption) {
                            handleSelectUser(
                              phase.id,
                              signerIndex,
                              selectedOption.user
                            );
                          }
                        }}
                        isSearchable
                      />
                    ) : (
                      <>
                        <strong>{signer.name}</strong>
                        <p>{signer.email}</p>
                      </>
                    )}
                  </div>

                  {phase.signers.length > 1 && (
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveSigner(phase.id, signerIndex)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {signerIndex !== phase.signers.length - 1 && (
                  <div className={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}

      <button className={styles.addPhaseButton} onClick={handleAddPhase}>
        Tambah Fase Penandatangan
      </button>

      <div className={styles.footer}>
        <button className={styles.backButton} onClick={handlePreviousPage}>
          Kembali
        </button>
        <button className={styles.nextButton} onClick={handleNextPage}>
          Lanjut
        </button>
      </div>
    </div>
  );
};

export default SignatureAssignment;
