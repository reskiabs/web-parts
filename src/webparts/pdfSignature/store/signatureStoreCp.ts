import { create } from "zustand";
import { persist } from "zustand/middleware";

type Signer = {
  id?: string;
  name?: string;
  email?: string;
  selected?: boolean;
};

type Phase = {
  id: number;
  signers: Signer[];
};

type SignaturePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SelectedDocument = {
  id: string;
  name: string;
  webUrl: string;
};

type SignedDocument = {
  id: string;
  name: string;
  webUrl: string;
  phases: Phase[];
  signaturePositions: Record<string, SignaturePosition>;
};

interface SignatureState {
  phases: Phase[];
  signStatus: Record<string, boolean>;
  signaturePositions: Record<string, SignaturePosition>;
  activeSignerIds: string[];
  selectedDocument?: SelectedDocument;
  signedDocuments: SignedDocument[];

  setPhases: (value: Phase[] | ((prev: Phase[]) => Phase[])) => void;
  setSignStatus: (key: string, value: boolean) => void;
  setSignaturePosition: (userId: string, position: SignaturePosition) => void;
  setActiveSignerIds: (ids: string[]) => void;
  setSelectedDocument: (doc: SelectedDocument) => void;
  addSignedDocument: (doc: SignedDocument) => void;
  clearPhases: () => void;
}

export const useSignatureStore = create<SignatureState>()(
  persist(
    (set, get) => ({
      phases: [],
      signStatus: {},
      signaturePositions: {},
      activeSignerIds: [],
      selectedDocument: undefined,
      signedDocuments: [],

      setPhases: (update) =>
        set((state) => ({
          phases: typeof update === "function" ? update(state.phases) : update,
        })),

      setSignStatus: (key, value) =>
        set((state) => ({
          signStatus: { ...state.signStatus, [key]: value },
        })),

      setSignaturePosition: (userId, position) =>
        set((state) => ({
          signaturePositions: {
            ...state.signaturePositions,
            [userId]: position,
          },
        })),

      setActiveSignerIds: (ids) =>
        set(() => ({
          activeSignerIds: ids,
        })),

      setSelectedDocument: (doc) =>
        set(() => ({
          selectedDocument: doc,
        })),

      addSignedDocument: (doc) =>
        set((state) => ({
          signedDocuments: [...state.signedDocuments, doc],
        })),

      clearPhases: () =>
        set({
          phases: [],
          signStatus: {},
          signaturePositions: {},
          activeSignerIds: [],
          selectedDocument: undefined,
        }),
    }),
    {
      name: "signature-storage",
      partialize: (state) => ({
        phases: state.phases,
        signStatus: state.signStatus,
        signaturePositions: state.signaturePositions,
        activeSignerIds: state.activeSignerIds,
        selectedDocument: state.selectedDocument,
        signedDocuments: state.signedDocuments,
      }),
    }
  )
);
