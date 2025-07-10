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

interface SignatureState {
  phases: Phase[];
  signStatus: Record<string, boolean>;
  signaturePositions: Record<string, SignaturePosition>;
  activeSignerIds: string[]; // ✅ Tambahkan ini
  setPhases: (value: Phase[] | ((prev: Phase[]) => Phase[])) => void;
  setSignStatus: (key: string, value: boolean) => void;
  setSignaturePosition: (userId: string, position: SignaturePosition) => void;
  setActiveSignerIds: (ids: string[]) => void; // ✅ Tambahkan ini
  clearPhases: () => void;
}

export const useSignatureStore = create<SignatureState>()(
  persist(
    (set) => ({
      phases: [],
      signStatus: {},
      signaturePositions: {},
      activeSignerIds: [], // ✅ Inisialisasi
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
      clearPhases: () =>
        set({
          phases: [],
          signStatus: {},
          signaturePositions: {},
          activeSignerIds: [], // ✅ Reset juga di sini
        }),
    }),
    {
      name: "signature-storage",
      partialize: (state) => ({
        phases: state.phases,
        signStatus: state.signStatus,
        signaturePositions: state.signaturePositions,
        activeSignerIds: state.activeSignerIds, // ✅ Pastikan ini dipersist
      }),
    }
  )
);
