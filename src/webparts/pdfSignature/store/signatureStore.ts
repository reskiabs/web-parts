import { create } from "zustand";

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

interface SignatureState {
  phases: Phase[];
  setPhases: (value: Phase[] | ((prev: Phase[]) => Phase[])) => void;
  clearPhases: () => void;
  signStatus: Record<string, boolean>;
  setSignStatus: (key: string, value: boolean) => void;
}

export const useSignatureStore = create<SignatureState>((set) => ({
  phases: [],
  signStatus: {},
  setPhases: (update) =>
    set((state) => ({
      phases: typeof update === "function" ? update(state.phases) : update,
    })),
  setSignStatus: (key, value) =>
    set((state) => ({
      signStatus: { ...state.signStatus, [key]: value },
    })),
  clearPhases: () => set({ phases: [], signStatus: {} }),
}));
