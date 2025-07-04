import { MSGraphClientFactory, MSGraphClientV3 } from "@microsoft/sp-http";
import { useEffect, useState } from "react";

export interface ISharedFile {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
}

interface UseSharedFilesResult {
  sharedFiles: ISharedFile[];
  loading: boolean;
  fetchSharedFiles: () => void;
  getFileById: (fileId: string) => ISharedFile | undefined;
}

export const useSharedFiles = (
  msGraphClientFactory: MSGraphClientFactory
): UseSharedFilesResult => {
  const [sharedFiles, setSharedFiles] = useState<ISharedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSharedFiles = (): void => {
    setLoading(true);
    msGraphClientFactory
      .getClient("3")
      .then((client: MSGraphClientV3) =>
        client.api("/me/drive/sharedWithMe").version("v1.0").get()
      )
      .then((response: { value: ISharedFile[] }) => {
        const pdfFiles = response.value.filter((file) =>
          file.name?.toLowerCase().endsWith(".pdf")
        );
        setSharedFiles(pdfFiles);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch shared files", error);
        setLoading(false);
      });
  };

  const getFileById = (fileId: string): ISharedFile | undefined => {
    return sharedFiles.find((file) => file.id === fileId);
  };

  useEffect(() => {
    fetchSharedFiles();
  }, [msGraphClientFactory]);

  return {
    sharedFiles,
    loading,
    fetchSharedFiles,
    getFileById,
  };
};
