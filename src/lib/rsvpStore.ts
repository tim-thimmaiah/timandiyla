import { create } from "zustand";
import { supabase } from "./supabase";

// Define the type for our RSVP form state
export type RSVPFormState = {
  name: string;
  email: string;
  guests: string[];
  message: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
};

// Define the type for our RSVP form actions
type RSVPFormActions = {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  addGuest: () => void;
  updateGuest: (index: number, name: string) => void;
  removeGuest: (index: number) => void;
  setMessage: (message: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
};

// Initial state for our form
const initialState: RSVPFormState = {
  name: "",
  email: "",
  guests: [],
  message: "",
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

// Create the store
export const useRSVPStore = create<RSVPFormState & RSVPFormActions>(
  (set, get) => ({
    ...initialState,

    // Actions to update the form state
    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),

    // Guest management
    addGuest: () => {
      const { guests } = get();
      set({ guests: [...guests, ""] });
    },

    updateGuest: (index, name) => {
      const { guests } = get();
      const updatedGuests = [...guests];
      updatedGuests[index] = name;
      set({ guests: updatedGuests });
    },

    removeGuest: (index) => {
      const { guests } = get();
      const updatedGuests = guests.filter((_, i) => i !== index);
      set({ guests: updatedGuests });
    },

    setMessage: (message) => set({ message }),

    // Reset the form to its initial state
    resetForm: () => set(initialState),

    // Submit the form
    submitForm: async () => {
      const { name, email, guests, message } = get();

      // Validate form
      if (!name || !email) {
        set({ error: "Please fill out all required fields" });
        return;
      }

      try {
        set({ isSubmitting: true, error: null });

        // Filter out empty guest names
        const validGuests = guests.filter((guest) => guest.trim() !== "");

        // Insert the RSVP data into Supabase
        const { error: supabaseError } = await supabase.from("rsvps").insert({
          name,
          email,
          guests: validGuests,
          message,
          created_at: new Date().toISOString(),
        });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        set({ isSubmitted: true, isSubmitting: false });
      } catch (error) {
        console.error("RSVP submission error:", error);
        set({
          isSubmitting: false,
          error:
            error instanceof Error
              ? error.message
              : "An error occurred while submitting the form",
        });
      }
    },
  })
);
