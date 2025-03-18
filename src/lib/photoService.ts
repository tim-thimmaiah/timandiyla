import { supabase } from "./supabase";
import { PolaroidItem } from "@/constants/polaroidData";

// Define the type for a photo from the database
export type PhotoFromDB = {
  id: string;
  storage_path: string;
  note: string;
  approved: boolean;
  created_at: string;
  rsvp_id: string | null;
  rsvps?: {
    id: string;
    name: string;
    email: string;
  } | null;
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
      };
    });
  } catch (error) {
    console.error("Error in fetchApprovedPhotos:", error);
    return [];
  }
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns The shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Fetches both static and user-submitted photos and integrates them randomly
 * @param staticPhotos The static photos to include
 * @returns A combined array of static and user-submitted photos
 */
export async function fetchAllPhotos(
  staticPhotos: PolaroidItem[]
): Promise<PolaroidItem[]> {
  try {
    // Fetch approved user-submitted photos
    const userPhotos = await fetchApprovedPhotos();

    if (userPhotos.length === 0) {
      return staticPhotos; // If no user photos, just return static ones
    }

    // Combine and shuffle all photos for a random integration
    const allPhotos = [...userPhotos, ...staticPhotos];
    return shuffleArray(allPhotos);
  } catch (error) {
    console.error("Error in fetchAllPhotos:", error);
    return staticPhotos; // Fall back to static photos if there's an error
  }
}

/**
 * API route handler to fetch all photos
 * This can be used by client components that can't use server actions directly
 */
export async function fetchPhotosApi(): Promise<PolaroidItem[]> {
  try {
    console.log("fetchPhotosApi: Starting to fetch approved photos");

    // Fetch approved photos from the database with rsvp_id information
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*, rsvps:rsvp_id(*)")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching approved photos:", error);
      return [];
    }

    console.log(
      `fetchPhotosApi: Found ${photos?.length || 0} approved photos in database`
    );

    if (!photos || photos.length === 0) {
      console.log("fetchPhotosApi: No approved photos found in database");
      return [];
    }

    // Log the first photo from the database for debugging
    console.log("fetchPhotosApi: First photo from DB:", {
      id: photos[0].id,
      storage_path: photos[0].storage_path,
      approved: photos[0].approved,
      created_at: photos[0].created_at,
      has_rsvp: photos[0].rsvp_id !== null,
    });

    // Convert the database photos to PolaroidItem format
    const polaroidItems = photos.map((photo: PhotoFromDB) => {
      // Get the public URL for the photo
      const { data } = supabase.storage
        .from("photos")
        .getPublicUrl(photo.storage_path);

      console.log(
        `fetchPhotosApi: Generated public URL for ${photo.storage_path}:`,
        data.publicUrl
      );

      // Check if this photo has an associated RSVP
      const isRsvp = photo.rsvp_id !== null;

      return {
        photoData: data.publicUrl,
        note: photo.note || "",
        isRsvp,
      };
    });

    console.log(
      `fetchPhotosApi: Returning ${polaroidItems.length} polaroid items`
    );
    return polaroidItems;
  } catch (error) {
    console.error("Error in fetchPhotosApi:", error);
    return [];
  }
}

/**
 * Fetches and combines both user-submitted and static photos in a format ready for the PolaroidCarousel
 * This is a server action that fetches photos at request time, processes them, and returns them ready to use
 */
export async function fetchCombinedPhotos(
  staticPhotos: PolaroidItem[]
): Promise<PolaroidItem[]> {
  try {
    console.log("fetchCombinedPhotos: Starting...");

    // Fetch approved photos from the database with rsvp_id information
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*, rsvps:rsvp_id(*)")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching approved photos:", error);
      return staticPhotos;
    }

    console.log(
      `fetchCombinedPhotos: Found ${photos?.length || 0} user-submitted photos`
    );

    if (!photos || photos.length === 0) {
      console.log(
        "fetchCombinedPhotos: No user photos, returning static photos only"
      );
      return staticPhotos.map((photo, index) => ({
        ...photo,
        id: index,
        isRsvp: false,
      }));
    }

    // Process user-submitted photos
    const userPhotos = photos.map((photo: PhotoFromDB) => {
      // Get the public URL for the photo
      const { data } = supabase.storage
        .from("photos")
        .getPublicUrl(photo.storage_path);

      return {
        photoData: data.publicUrl,
        note: photo.note || "",
        isRsvp: photo.rsvp_id !== null,
      };
    });

    // Process static photos to ensure consistent format
    const processedStaticPhotos = staticPhotos.map((photo) => ({
      ...photo,
      isRsvp: false,
    }));

    // Combine and shuffle all photos
    const combinedPhotos = [...userPhotos, ...processedStaticPhotos];
    return shuffleArray(combinedPhotos);
  } catch (error) {
    console.error("Error in fetchCombinedPhotos:", error);
    return staticPhotos.map((photo, index) => ({
      ...photo,
      id: index,
      isRsvp: false,
    }));
  }
}
