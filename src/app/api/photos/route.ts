import { NextResponse } from "next/server";
import { fetchPhotosApi } from "@/lib/photoService";
import { polaroidData } from "@/constants/polaroidData";

// This API route is now only used as a fallback or for client-side fetching if needed
export async function GET() {
  try {
    console.log("API route: Fetching photos...");
    const photos = await fetchPhotosApi(polaroidData);
    console.log(`API route: Fetched ${photos.length} photos`);

    // Log the first photo for debugging (if available)
    if (photos.length > 0) {
      console.log("API route: First photo sample:", {
        photoUrl: photos[0].photoData,
        note: photos[0].note,
      });
    } else {
      console.log("API route: No photos returned from fetchPhotosApi");
    }

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}
