import { MSGraphClientV3 } from "@microsoft/sp-http";
import { useEffect, useState } from "react";

export interface ISharedFile {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
}

export const useSharedFiles = (msGraphClientFactory: any) => {
  const [sharedFiles, setSharedFiles] = useState<ISharedFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      .catch((err: any) => {
        console.error("Failed to fetch shared files", err);
        setLoading(false);
      });
  }, [msGraphClientFactory]);

  return { sharedFiles, loading };
};
