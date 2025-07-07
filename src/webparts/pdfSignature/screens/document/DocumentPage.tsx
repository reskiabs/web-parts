import { CircleArrowLeft } from "lucide-react";
import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import { useLocation, useParams } from "react-router-dom";
import { IPdfSignatureProps } from "../../components/IPdfSignatureProps";
import UserSelector from "../../components/user/UserSelector";
import { ISharedFile, useSharedFiles } from "../../hooks/useSharedFiles";
import { useUsers } from "../../hooks/useUsers";
import styles from "./DocumentPage.module.scss";

interface RouteParams {
  fileId: string;
}

interface LocationState {
  file?: ISharedFile;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { fileId } = useParams<RouteParams>();
  const location = useLocation<LocationState>();
  const { loading, getFileById } = useSharedFiles(context.msGraphClientFactory);
  const { users } = useUsers(context.msGraphClientFactory);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
  const [signaturePositions, setSignaturePositions] = React.useState<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({});

  const [isSign, setIsSign] = React.useState<boolean>(false);
  const [signType, setSignType] = React.useState<
    "signature" | "initials" | null
  >(null);

  const [pageNumber, setPageNumber] = React.useState<number>(1);

  const topRef = React.useRef<HTMLDivElement>(null);

  const handleSign = (): void => {
    setIsSign(true);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserChange = (newUserIds: string[]) => {
    setSelectedUserIds(newUserIds);

    setSignaturePositions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((userId) => {
        if (!newUserIds.includes(userId)) {
          delete updated[userId];
        }
      });
      return updated;
    });
  };

  const fileFromState = location.state?.file;
  const fileFromId = getFileById(fileId);
  const file = fileFromState || fileFromId;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setPageNumber(1);
  };

  if (loading) {
    return <div className={styles.container}>Memuat file...</div>;
  }

  if (!file) {
    return (
      <div className={styles.container} ref={topRef}>
        <p>File dengan ID {fileId} tidak ditemukan.</p>
      </div>
    );
  }

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
          isSign={isSign}
          signType={signType}
          setSignType={setSignType}
          onChange={handleUserChange}
        />
      </div>

      <div className={styles.pdfContainer}>
        <Document
          file={file.webUrl}
          onLoadSuccess={onDocumentLoadSuccess}
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

        {signType === "signature" &&
          selectedUserIds.map((userId) => {
            const position = signaturePositions[userId] || {
              x: 100,
              y: 100,
              width: 250,
              height: 100,
            };

            return (
              <Rnd
                key={userId}
                size={{ width: position.width, height: position.height }}
                position={{ x: position.x, y: position.y }}
                onDragStop={(e, d) => {
                  setSignaturePositions((prev) => ({
                    ...prev,
                    [userId]: {
                      ...prev[userId],
                      x: d.x,
                      y: d.y,
                      width: prev[userId]?.width ?? 250,
                      height: prev[userId]?.height ?? 100,
                    },
                  }));
                }}
                onResizeStop={(e, direction, ref, delta, pos) => {
                  setSignaturePositions((prev) => ({
                    ...prev,
                    [userId]: {
                      x: pos.x,
                      y: pos.y,
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                    },
                  }));
                }}
                bounds="parent"
                style={{
                  border: "2px dashed #0078D4",
                  background: "rgba(0, 120, 212, 0.1)",
                  color: "#0078D4",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  cursor: "move",
                  borderRadius: "4px",
                }}
              >
                Tanda Tangan {userId}
              </Rnd>
            );
          })}
      </div>

      <div className={styles.actionContainer}>
        <button
          className={`${styles.lanjutButton} ${
            selectedUserIds.length === 0
              ? styles.disabledButton
              : styles.enabledButton
          }`}
          disabled={selectedUserIds.length === 0}
          onClick={handleSign}
        >
          {isSign ? "Kirim ke AkuSign" : "Lanjutkan"}
        </button>
      </div>
    </div>
  );
};

export default DocumentPage;
