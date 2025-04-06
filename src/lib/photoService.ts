import { supabase } from "./supabase";
import { PolaroidItem } from "@/constants/polaroidData";
import { useRSVPStore } from "./rsvpStore";

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
      // If no user photos, keep first static photo at beginning and shuffle the rest
      const firstPhoto = staticPhotos[0];
      const restPhotos = staticPhotos.slice(1);
      return [firstPhoto, ...shuffleArray(restPhotos)];
    }

    // Keep the first static photo at the beginning and shuffle the rest
    const firstPhoto = staticPhotos[0];
    const restPhotos = [...userPhotos, ...staticPhotos.slice(1)];
    return [firstPhoto, ...shuffleArray(restPhotos)];
  } catch (error) {
    console.error("Error in fetchAllPhotos:", error);
    // Fall back to static photos if there's an error
    // Still keep first photo first and shuffle the rest
    const firstPhoto = staticPhotos[0];
    const restPhotos = staticPhotos.slice(1);
    return [firstPhoto, ...shuffleArray(restPhotos)];
  }
}

/**
 * API route handler to fetch all photos
 * This can be used by client components that can't use server actions directly
 */
export async function fetchPhotosApi(
  staticPhotos?: PolaroidItem[]
): Promise<PolaroidItem[]> {
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
      return staticPhotos && staticPhotos.length > 0
        ? [staticPhotos[0], ...shuffleArray(staticPhotos.slice(1))]
        : [];
    }

    console.log(
      `fetchPhotosApi: Found ${photos?.length || 0} approved photos in database`
    );

    if (!photos || photos.length === 0) {
      console.log("fetchPhotosApi: No approved photos found in database");
      return staticPhotos && staticPhotos.length > 0
        ? [staticPhotos[0], ...shuffleArray(staticPhotos.slice(1))]
        : [];
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

    // If we have static photos, put the first one at the beginning
    if (staticPhotos && staticPhotos.length > 0) {
      const firstStaticPhoto = {
        ...staticPhotos[0],
        isRsvp: false,
      };

      // Combine the rest of the static photos with user photos and shuffle
      const restPhotos = [
        ...polaroidItems,
        ...staticPhotos.slice(1).map((photo) => ({
          ...photo,
          isRsvp: false,
        })),
      ];

      console.log(
        `fetchPhotosApi: Returning first static photo + ${restPhotos.length} shuffled items`
      );

      return [firstStaticPhoto, ...shuffleArray(restPhotos)];
    } else {
      // If no static photos were provided, just return user photos
      console.log(
        `fetchPhotosApi: Returning ${polaroidItems.length} polaroid items (no static photos)`
      );
      return polaroidItems;
    }
  } catch (error) {
    console.error("Error in fetchPhotosApi:", error);
    return staticPhotos && staticPhotos.length > 0
      ? [staticPhotos[0], ...shuffleArray(staticPhotos.slice(1))]
      : [];
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

    // Log the first static photo
    console.log("fetchCombinedPhotos: First static photo:", {
      photoData: staticPhotos[0]?.photoData,
      note: staticPhotos[0]?.note,
    });

    // Log the total number of static photos
    console.log(
      `fetchCombinedPhotos: Total static photos: ${staticPhotos.length}`
    );

    // Check if there's a user RSVP with a photo
    // We can't directly access the store on the server, but we can check client-side
    let userPhotoUrl = null;
    let userName = null;

    // This will only work on the client side, not during SSR
    if (typeof window !== "undefined") {
      try {
        const rsvpStore = useRSVPStore.getState();
        userPhotoUrl = rsvpStore.photoUrl;
        userName = rsvpStore.name;

        if (userPhotoUrl) {
          console.log(`Found user photo for ${userName}:`, userPhotoUrl);
        }
      } catch {
        console.log("Unable to access RSVP store on server");
      }
    }

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

    console.log(
      `fetchCombinedPhotos: Processed ${userPhotos.length} user photos`
    );

    // Process static photos to ensure consistent format
    const processedStaticPhotos = staticPhotos.map((photo) => ({
      ...photo,
      isRsvp: false,
    }));

    // Create the result array
    let result: PolaroidItem[] = [];

    // If we have a user's own photo from the RSVP store, show it first
    if (userPhotoUrl) {
      result.push({
        photoData: userPhotoUrl,
        note: `${userName || "Your"} photo`,
        isRsvp: true,
      });
    }

    // Add the first static photo
    const firstStaticPhoto = processedStaticPhotos[0];
    result.push(firstStaticPhoto);

    // Then add the rest of the photos shuffled
    const restPhotos = [...userPhotos, ...processedStaticPhotos.slice(1)];
    const shuffledRest = shuffleArray(restPhotos);
    result = [...result, ...shuffledRest];

    console.log("fetchCombinedPhotos: Result's first photo:", {
      photoData: result[0]?.photoData,
      note: result[0]?.note,
    });
    console.log(`fetchCombinedPhotos: Returning ${result.length} total photos`);

    return result;
  } catch (fetchError) {
    console.error("Error in fetchCombinedPhotos:", fetchError);

    // Handle error case, still try to display user photo if available
    let result = staticPhotos;

    // Check for user photo on client side
    if (typeof window !== "undefined") {
      try {
        const rsvpStore = useRSVPStore.getState();
        const userPhotoUrl = rsvpStore.photoUrl;
        const userName = rsvpStore.name;

        if (userPhotoUrl) {
          // Insert user's photo at the beginning
          result = [
            {
              photoData: userPhotoUrl,
              note: `${userName || "Your"} photo`,
              isRsvp: true,
            },
            staticPhotos[0], // First static photo
            ...shuffleArray(staticPhotos.slice(1)).map((photo) => ({
              ...photo,
              isRsvp: false,
            })),
          ];
        } else {
          // Fallback to regular pattern with first static photo first
          const firstPhoto = staticPhotos[0];
          const restPhotos = staticPhotos.slice(1);
          const shuffledRest = shuffleArray(restPhotos);

          result = [
            { ...firstPhoto, isRsvp: false },
            ...shuffledRest.map((photo) => ({
              ...photo,
              isRsvp: false,
            })),
          ];
        }
      } catch {
        console.log("Unable to access RSVP store on server");
      }
    }

    console.log("fetchCombinedPhotos (error path): Result's first photo:", {
      photoData: result[0]?.photoData,
      note: result[0]?.note,
    });
    console.log(
      `fetchCombinedPhotos (error path): Returning ${result.length} total photos`
    );

    return result;
  }
}
