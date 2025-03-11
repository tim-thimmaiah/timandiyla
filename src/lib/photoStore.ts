import { create } from "zustand";

// Define the type for our photo memory state
export type PhotoMemoryState = {
  photoData: string | null; // Base64 encoded photo data
  note: string;
  isCapturing: boolean;
};

// Define the type for our photo memory actions
type PhotoMemoryActions = {
  setPhotoData: (photoData: string | null) => void;
  setNote: (note: string) => void;
  setIsCapturing: (isCapturing: boolean) => void;
  resetPhotoMemory: () => void;
};

// Initial state for our photo memory
const initialState: PhotoMemoryState = {
  photoData: null,
  note: "",
  isCapturing: false,
};

// Create the store
export const usePhotoMemoryStore = create<
  PhotoMemoryState & PhotoMemoryActions
>((set) => ({
  ...initialState,

  // Actions to update the photo memory state
  setPhotoData: (photoData) => set({ photoData }),
  setNote: (note) => set({ note }),
  setIsCapturing: (isCapturing) => set({ isCapturing }),

  // Reset the photo memory to its initial state
  resetPhotoMemory: () => set(initialState),
}));
