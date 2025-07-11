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
  sender_name?: string;
  sender_email?: string;
  expired_at?: string;
  signed_by?: string[]; // ⬅️ NEW: Menyimpan array userId penandatangan
  is_signed?: boolean; // ⬅️ NEW: Menyimpan status signed secara global
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
  currentSignature?: CurrentSignatureData;
  signedDocuments: DocumentData[];

  setCurrentSignature: (doc: CurrentSignatureData | undefined) => void;
  updateCurrentSignature: (partial: Partial<CurrentSignatureData>) => void;
  clearCurrentSignature: () => void;

  addSignedDocument: (doc: DocumentData) => void;
  markDocumentAsSigned: (docId: string, userId: string) => void; // ⬅️ NEW
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

      markDocumentAsSigned: (docId, userId) =>
        set((state) => ({
          signedDocuments: state.signedDocuments.map((doc) =>
            doc.id === docId
              ? {
                  ...doc,
                  is_signed: true,
                  signed_by: doc.signed_by
                    ? Array.from(new Set([...doc.signed_by, userId]))
                    : [userId],
                }
              : doc
          ),
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
