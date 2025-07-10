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
  name: string;
  webUrl: string;
};

interface SignatureState {
  phases: Phase[];
  signStatus: Record<string, boolean>;
  signaturePositions: Record<string, SignaturePosition>;
  activeSignerIds: string[];
  selectedDocument: SelectedDocument | null;
  setPhases: (value: Phase[] | ((prev: Phase[]) => Phase[])) => void;
  setSignStatus: (key: string, value: boolean) => void;
  setSignaturePosition: (userId: string, position: SignaturePosition) => void;
  setActiveSignerIds: (ids: string[]) => void;
  setSelectedDocument: (doc: SelectedDocument) => void;
  clearPhases: () => void;
}

export const useSignatureStore = create<SignatureState>()(
  persist(
    (set) => ({
      phases: [],
      signStatus: {},
      signaturePositions: {},
      activeSignerIds: [],
      selectedDocument: null, // ⬅️ Tambahkan selectedDocument

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

      clearPhases: () =>
        set({
          phases: [],
          signStatus: {},
          signaturePositions: {},
          activeSignerIds: [],
          selectedDocument: null, // ⬅️ Reset juga selectedDocument
        }),
    }),
    {
      name: "signature-storage",
      partialize: (state) => ({
        phases: state.phases,
        signStatus: state.signStatus,
        signaturePositions: state.signaturePositions,
        activeSignerIds: state.activeSignerIds,
        selectedDocument: state.selectedDocument, // ⬅️ Persist selectedDocument
      }),
    }
  )
);
