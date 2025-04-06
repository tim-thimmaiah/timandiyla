import { create } from "zustand";
import { supabase } from "./supabase";
import { useRSVPStore } from "./rsvpStore";

// Define the type for our photo memory state
export type PhotoMemoryState = {
  photoData: string | null; // Base64 encoded photo data
  note: string;
  isCapturing: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  photoUrl: string | null;
};

// Define the type for our photo memory actions
type PhotoMemoryActions = {
  setPhotoData: (photoData: string | null) => void;
  setNote: (note: string) => void;
  setIsCapturing: (isCapturing: boolean) => void;
  resetPhotoMemory: () => void;
  savePhotoMemory: () => Promise<void>;
};

// Initial state for our photo memory
const initialState: PhotoMemoryState = {
  photoData: null,
  note: "",
  isCapturing: false,
  isSubmitting: false,
  isSubmitted: false,
  error: null,
  photoUrl: null,
};

// Helper function to convert base64 to a Blob
const base64ToBlob = (base64: string): Blob => {
  // Remove data URL prefix if present
  const base64Data = base64.includes("base64,")
    ? base64.split("base64,")[1]
    : base64;

  // Convert base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the binary data
  return new Blob([bytes], { type: "image/jpeg" });
};

// Create the store
export const usePhotoMemoryStore = create<
  PhotoMemoryState & PhotoMemoryActions
>((set, get) => ({
  ...initialState,

  // Actions to update the photo memory state
  setPhotoData: (photoData) => set({ photoData }),
  setNote: (note) => set({ note }),
  setIsCapturing: (isCapturing) => set({ isCapturing }),

  // Reset the photo memory to its initial state
  resetPhotoMemory: () => set(initialState),

  // Save the photo memory to Supabase
  savePhotoMemory: async () => {
    const { photoData, note } = get();
    const rsvpStore = useRSVPStore.getState();
    const { name, email, id: rsvpId } = rsvpStore;

    console.log("RSVP data:", { name, email, rsvpId });

    // Validate that we have a photo
    if (!photoData) {
      set({ error: "No photo to save" });
      return;
    }

    try {
      set({ isSubmitting: true, error: null });

      // Convert base64 photo data to a Blob
      const photoBlob = base64ToBlob(photoData);

      // Generate a unique filename
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${Math.random()
        .toString(36)
        .substring(2, 15)}.jpg`;
      const filePath = `public/${filename}`;

      // Upload the photo to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("photos")
        .upload(filePath, photoBlob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
        });

      if (storageError) {
        throw new Error(storageError.message);
      }

      // Get the public URL for the uploaded photo
      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const photoUrl = publicUrlData.publicUrl;

      // Find or create the RSVP record for this user
      let finalRsvpId = rsvpId;

      if (!finalRsvpId && email) {
        // If no RSVP ID is available in the store, try to find it by email
        const { data: rsvpData, error: rsvpError } = await supabase
          .from("rsvps")
          .select("id")
          .eq("email", email)
          .order("created_at", { ascending: false })
          .limit(1);

        if (rsvpError) {
          console.error("Error finding RSVP record:", rsvpError);
        } else {
          console.log("RSVP lookup result:", rsvpData);
          if (rsvpData && rsvpData.length > 0) {
            finalRsvpId = rsvpData[0].id;
            console.log("Found RSVP ID:", finalRsvpId);
          } else {
            console.log("No RSVP record found for email:", email);

            // If no RSVP record exists, create one
            if (name && email) {
              const { data: newRsvp, error: createError } = await supabase
                .from("rsvps")
                .insert({
                  name,
                  email,
                  attending: true,
                  guests: 0,
                  dietary_requirements: "",
                  message: "Created from photo memory submission",
                })
                .select();

              if (createError) {
                console.error("Error creating RSVP record:", createError);
              } else if (newRsvp && newRsvp.length > 0) {
                finalRsvpId = newRsvp[0].id;
                console.log("Created new RSVP ID:", finalRsvpId);
              }
            }
          }
        }
      } else {
        console.log("Using RSVP ID from store:", finalRsvpId);
      }

      console.log("Final RSVP ID:", finalRsvpId);

      // Insert a record in the photos table
      const { error: photoError } = await supabase.from("photos").insert({
        rsvp_id: finalRsvpId,
        storage_path: filePath,
        note,
        approved: true, // Auto-approve photos so they appear on the home page
      });

      if (photoError) {
        throw new Error(photoError.message);
      }

      console.log("Photo saved successfully with RSVP ID:", finalRsvpId);

      // Save the photo URL to the RSVP store
      rsvpStore.setPhotoUrl(photoUrl);

      // Update state with success
      set({
        isSubmitted: true,
        isSubmitting: false,
        photoUrl,
      });
    } catch (error) {
      console.error("Photo submission error:", error);
      set({
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while saving your photo",
      });
    }
  },
}));
