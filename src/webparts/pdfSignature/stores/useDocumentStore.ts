import create from "zustand";

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DocumentState {
  selectedUserIds: string[];
  signedUserIds: string[];
  signaturePositions: Record<string, SignaturePosition>;
  isSigning: boolean;
  signType?: "signature" | "initials";
  selectedUserId?: string;
  pageNumber: number;
  setSelectedUserIds: (ids: string[]) => void;
  addSignedUserId: (id: string) => void;
  setSignaturePosition: (id: string, position: SignaturePosition) => void;
  setIsSigning: (isSigning: boolean) => void;
  setSignType: (type: "signature" | "initials" | undefined) => void;
  setSelectedUserId: (id: string | undefined) => void;
  setPageNumber: (page: number) => void;
  resetState: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  selectedUserIds: [],
  signedUserIds: [],
  signaturePositions: {},
  isSigning: false,
  signType: undefined,
  selectedUserId: undefined,
  pageNumber: 1,
  setSelectedUserIds: (ids) =>
    set((state) => {
      const newSignaturePositions = { ...state.signaturePositions };
      Object.keys(newSignaturePositions).forEach((userId) => {
        if (!ids.includes(userId)) delete newSignaturePositions[userId];
      });
      return {
        selectedUserIds: ids,
        signaturePositions: newSignaturePositions,
      };
    }),
  addSignedUserId: (id) =>
    set((state) => ({
      signedUserIds: state.signedUserIds.includes(id)
        ? state.signedUserIds
        : [...state.signedUserIds, id],
    })),
  setSignaturePosition: (id, position) =>
    set((state) => ({
      signaturePositions: { ...state.signaturePositions, [id]: position },
    })),
  setIsSigning: (isSigning) => set({ isSigning }),
  setSignType: (signType) => set({ signType }),
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  setPageNumber: (pageNumber) => set({ pageNumber }),
  resetState: () =>
    set({
      selectedUserIds: [],
      signedUserIds: [],
      signaturePositions: {},
      isSigning: false,
      signType: undefined,
      selectedUserId: undefined,
      pageNumber: 1,
    }),
}));
