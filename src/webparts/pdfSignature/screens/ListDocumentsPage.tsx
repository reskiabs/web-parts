import * as React from "react";
import { useHistory } from "react-router-dom";
import DocumentList from "../components/document/DocumentList";
import { IPdfSignatureProps } from "../components/IPdfSignatureProps";
import styles from "../components/PdfSignature.module.scss";
import { ISharedFile, useSharedFiles } from "../hooks/useSharedFiles";

const ListDocumentsPage: React.FC<IPdfSignatureProps> = ({ context }) => {
  const { sharedFiles } = useSharedFiles(context.msGraphClientFactory);
  const history = useHistory();

  const handlePreview = (file: ISharedFile): void => {
    history.push(`/document/${file.id}`, { file });
  };

  return (
    <div className={styles.pdfSignature}>
      <DocumentList sharedFiles={sharedFiles} onPreview={handlePreview} />
    </div>
  );
};

export default ListDocumentsPage;
