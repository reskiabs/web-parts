import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Type Definitions
export type Signer = {
  id?: string;
  name?: string;
  email?: string;
  selected?: boolean;
};

export type Phase = {
  id: number;
  signers: Signer[];
};

export type SignaturePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DocumentData = {
  id: string;
  name: string;
  webUrl: string;
  phases: Phase[];
  signaturePositions: Record<string, SignaturePosition>;
};

export type CurrentSignatureData = {
  id: string;
  name: string;
  webUrl: string;
  phases: Phase[];
  signaturePositions: Record<string, SignaturePosition>;
  signStatus: Record<string, boolean>;
  activeSignerIds: string[];
};

// ✅ State Interface
interface SignatureState {
  currentSignature?: CurrentSignatureData; // 🔑 Perbaiki di sini
  signedDocuments: DocumentData[];

  setCurrentSignature: (doc: CurrentSignatureData | undefined) => void;
  updateCurrentSignature: (partial: Partial<CurrentSignatureData>) => void;
  clearCurrentSignature: () => void;

  addSignedDocument: (doc: DocumentData) => void;
}

// ✅ Zustand Store
export const useSignatureStore = create<SignatureState>()(
  persist(
    (set, get) => ({
      currentSignature: undefined,
      signedDocuments: [],

      setCurrentSignature: (doc) => set({ currentSignature: doc }),

      updateCurrentSignature: (partial) =>
        set((state) => ({
          currentSignature: state.currentSignature
            ? { ...state.currentSignature, ...partial }
            : undefined,
        })),

      clearCurrentSignature: () => set({ currentSignature: undefined }),

      addSignedDocument: (doc) =>
        set((state) => ({
          signedDocuments: [...state.signedDocuments, doc],
        })),
    }),
    {
      name: "signature-storage",
      partialize: (state) => ({
        currentSignature: state.currentSignature,
        signedDocuments: state.signedDocuments,
      }),
    }
  )
);
