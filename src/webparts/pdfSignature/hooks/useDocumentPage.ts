import { useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { IPdfSignatureProps } from "../components/IPdfSignatureProps";
import { ISharedFile, useSharedFiles } from "./useSharedFiles";
import { useUsers } from "./useUsers";

interface RouteParams {
  fileId: string;
}

interface LocationState {
  file?: ISharedFile;
}

export const useDocumentPage = (context: IPdfSignatureProps["context"]) => {
  const history = useHistory();
  const { fileId } = useParams<RouteParams>();
  const location = useLocation<LocationState>();
  const { loading, getFileById } = useSharedFiles(context.msGraphClientFactory);
  const { users } = useUsers(context.msGraphClientFactory);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [signedUserIds, setSignedUserIds] = useState<string[]>([]);
  const [signaturePositions, setSignaturePositions] = useState<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({});

  const [isSign, setIsSign] = useState(false);
  const [signType, setSignType] = useState<
    "signature" | "initials" | undefined
  >(undefined);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const [pageNumber, setPageNumber] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const fileFromState = location.state?.file;
  const fileFromId = getFileById(fileId);
  const file = fileFromState || fileFromId;

  const handleNext = () => {
    setIsSign(true);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSign = () => {
    if (selectedUserId && !signedUserIds.includes(selectedUserId)) {
      setSignedUserIds((prev) => [...prev, selectedUserId]);
    }
  };

  const handleSend = () => history.push("/signed-documents");

  const handleUserChange = (newUserIds: string[]) => {
    setSelectedUserIds(newUserIds);
    setSignaturePositions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((userId) => {
        if (!newUserIds.includes(userId)) delete updated[userId];
      });
      return updated;
    });
  };

  const getUserNameById = (id: string) =>
    users.find((u) => u.id === id)?.displayName || id;

  return {
    users,
    loading,
    file,
    topRef,
    pageNumber,
    setPageNumber,
    isSign,
    signType,
    setSignType,
    selectedUserId,
    setSelectedUserId,
    selectedUserIds,
    signedUserIds,
    signaturePositions,
    setSignaturePositions,
    handleUserChange,
    handleNext,
    handleSign,
    handleSend,
    getUserNameById,
  };
};
