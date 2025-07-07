import { CircleArrowLeft } from "lucide-react";
import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd"; // ✅ react-rnd di sini
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
  const [isSign, setIsSign] = React.useState<boolean>(false);

  // const [numPages, setNumPages] = React.useState<number>(0);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [signaturePosition, setSignaturePosition] = React.useState({
    x: 100,
    y: 100,
    width: 250,
    height: 200,
  });

  const topRef = React.useRef<HTMLDivElement>(null);

  const handleSign = (): void => {
    setIsSign(true);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fileFromState = location.state?.file;
  const fileFromId = getFileById(fileId);
  const file = fileFromState || fileFromId;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    // setNumPages(numPages);
    setPageNumber(1);
  };

  // const goToPrevPage = (): void =>
  //   setPageNumber((prev) => Math.max(prev - 1, 1));

  // const goToNextPage = (): void =>
  //   setPageNumber((prev) => Math.min(prev + 1, numPages));

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
          onChange={setSelectedUserIds}
          isSign={isSign}
        />
      </div>

      <div className={styles.pdfContainer}>
        <Document
          file={file.webUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Memuat PDF..."
          error="Gagal memuat PDF"
        >
          <Page pageNumber={pageNumber} width={800} />
        </Document>

        {isSign && (
          <Rnd
            size={{
              width: signaturePosition.width,
              height: signaturePosition.height,
            }}
            position={{ x: signaturePosition.x, y: signaturePosition.y }}
            onDragStop={(e, d) => {
              setSignaturePosition((prev) => ({ ...prev, x: d.x, y: d.y }));
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setSignaturePosition({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
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
            Tanda Tangan
          </Rnd>
        )}

        {/* <div className={styles.pagination}>
          <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
            Previous
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
            Next
          </button>
        </div> */}
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
