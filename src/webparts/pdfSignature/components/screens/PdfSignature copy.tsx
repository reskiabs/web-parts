import * as React from "react";
import { useSharedFiles } from "../../hooks/useSharedFiles";
import DocumentList from "../document/DocumentList";
import type { IPdfSignatureProps } from "../IPdfSignatureProps";
import styles from "../PdfSignature.module.scss";

const PdfSignature: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { sharedFiles } = useSharedFiles(context.msGraphClientFactory);
  const [setSelectedFile] = React.useState<any>(undefined);

  return (
    <div className={styles.pdfSignature}>
      <DocumentList sharedFiles={sharedFiles} onPreview={setSelectedFile} />
    </div>
  );
};

export default PdfSignature;
