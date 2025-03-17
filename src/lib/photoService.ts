import { supabase } from "./supabase";
import { PolaroidItem } from "@/constants/polaroidData";

// Define the type for a photo from the database
export type PhotoFromDB = {
  id: string;
  storage_path: string;
  note: string;
  approved: boolean;
  created_at: string;
};

/**
 * Fetches approved user-submitted photos from Supabase
 * @returns An array of PolaroidItem objects
 */
export async function fetchApprovedPhotos(): Promise<PolaroidItem[]> {
  try {
    // Fetch approved photos from the database
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching approved photos:", error);
      return [];
    }

    // Convert the database photos to PolaroidItem format
    return photos.map((photo: PhotoFromDB) => {
      // Get the public URL for the photo
      const { data } = supabase.storage
        .from("photos")
        .getPublicUrl(photo.storage_path);

      return {
        photoData: data.publicUrl,
        note: photo.note || "",
        badge: "coming", // Default badge for user-submitted photos
      };
    });
  } catch (error) {
    console.error("Error in fetchApprovedPhotos:", error);
    return [];
  }
}

/**
 * Fetches both static and user-submitted photos
 * @param staticPhotos The static photos to include
 * @returns A combined array of static and user-submitted photos
 */
export async function fetchAllPhotos(
  staticPhotos: PolaroidItem[]
): Promise<PolaroidItem[]> {
  try {
    // Fetch approved user-submitted photos
    const userPhotos = await fetchApprovedPhotos();

    // Combine static and user-submitted photos
    // We'll put user photos first since they're more recent and personal
    return [...userPhotos, ...staticPhotos];
  } catch (error) {
    console.error("Error in fetchAllPhotos:", error);
    return staticPhotos; // Fall back to static photos if there's an error
  }
}
