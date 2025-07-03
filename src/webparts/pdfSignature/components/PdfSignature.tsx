import { MSGraphClientV3 } from "@microsoft/sp-http";
import * as React from "react";
import type { IPdfSignatureProps } from "./IPdfSignatureProps";
import styles from "./PdfSignature.module.scss";

interface IUser {
  id: string;
  displayName: string;
  mail: string;
}

interface ISharedFile {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
}

interface IPdfSignatureState {
  users: IUser[];
  selectedUserId: string;
  sharedFiles: ISharedFile[];
  selectedFile?: ISharedFile;
}

export default class PdfSignature extends React.Component<
  IPdfSignatureProps,
  IPdfSignatureState
> {
  constructor(props: IPdfSignatureProps) {
    super(props);
    this.state = {
      users: [],
      selectedUserId: "",
      sharedFiles: [],
      selectedFile: undefined,
    };
  }

  public componentDidMount(): void {
    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((client: MSGraphClientV3) => {
        return client
          .api("/users")
          .version("v1.0")
          .get()
          .then((response: { value: IUser[] }) => {
            this.setState({ users: response.value });
            return client;
          });
      })
      .then((client: MSGraphClientV3) => {
        return client
          .api("/me/drive/sharedWithMe")
          .version("v1.0")
          .get()
          .then((response: { value: ISharedFile[] }) => {
            const pdfFiles = response.value.filter((file) =>
              file.name?.toLowerCase().endsWith(".pdf")
            );
            this.setState({ sharedFiles: pdfFiles });
          });
      })
      .catch((err) => {
        console.error("Failed to fetch data from Graph API", err);
      });
  }

  private handleUserChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    this.setState({ selectedUserId: event.target.value });
  };

  private handlePreviewFile = (file: ISharedFile): void => {
    this.setState({ selectedFile: file });
  };

  public render(): React.ReactElement<IPdfSignatureProps> {
    const { users, selectedUserId, sharedFiles, selectedFile } = this.state;
    const selectedUser = users.find((u) => u.id === selectedUserId);

    return (
      <div className={styles.pdfSignature}>
        <h2>Pilih User dari Organisasi</h2>

        {users.length === 0 ? (
          <p>Memuat data pengguna...</p>
        ) : (
          <select
            onChange={this.handleUserChange}
            value={selectedUserId}
            className={styles.selectBox}
          >
            <option value="">-- Pilih user --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName} ({user.mail || "no email"})
              </option>
            ))}
          </select>
        )}

        {selectedUser && (
          <div className={styles.userDetail}>
            <h3>Detail Pengguna:</h3>
            <p>
              <strong>Nama:</strong> {selectedUser.displayName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.mail || "Tidak tersedia"}
            </p>
            <p>
              <strong>ID:</strong> {selectedUser.id}
            </p>
          </div>
        )}

        <hr />

        <h2>File PDF yang Dibagikan ke Saya</h2>
        {sharedFiles.length === 0 ? (
          <p>Tidak ada file PDF yang dibagikan atau masih memuat...</p>
        ) : (
          <ul>
            {sharedFiles.map((file) => (
              <li key={file.id}>
                <button
                  onClick={() => this.handlePreviewFile(file)}
                  className={styles.linkButton}
                >
                  {file.name}
                </button>{" "}
                <small>
                  (Terakhir diubah:{" "}
                  {new Date(file.lastModifiedDateTime).toLocaleString()})
                </small>
              </li>
            ))}
          </ul>
        )}

        {selectedFile && (
          <div className={styles.previewContainer}>
            <h3>Preview PDF: {selectedFile.name}</h3>
            <iframe
              src={selectedFile.webUrl}
              width="100%"
              height="600px"
              title={selectedFile.name}
              style={{ border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
        )}
      </div>
    );
  }
}
