"use client";

import { useState, useEffect, useRef } from "react";
import PolaroidCarousel from "./PolaroidCarousel";
import { PolaroidItem } from "@/constants/polaroidData";

interface DynamicPolaroidCarouselProps {
  initialPolaroids: PolaroidItem[];
}

export default function DynamicPolaroidCarousel({
  initialPolaroids,
}: DynamicPolaroidCarouselProps) {
  const [polaroids, setPolaroids] = useState<PolaroidItem[]>(initialPolaroids);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to store initialPolaroids to avoid dependency issues
  const initialPolaroidsRef = useRef(initialPolaroids);

  // Function to shuffle an array
  const shuffleArray = (array: PolaroidItem[]): PolaroidItem[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Fetch photos from the API
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/photos");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch photos: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        // Create a new array with explicit isRsvp property
        const photosWithRsvp = data.photos.map((photo: unknown) => {
          // Cast to a more specific type
          const photoObj = photo as {
            photoData?: string;
            note?: string;
            badge?: string;
          };

          // Create a new object with all properties explicitly set
          const processedPhoto = {
            photoData: photoObj.photoData || "",
            note: photoObj.note || "",
            badge: photoObj.badge || "cantWait",
            isRsvp: true, // Force isRsvp to be true
          };

          return processedPhoto;
        });

        // Combine API photos with initial (static) photos
        const combinedPhotos = [
          ...photosWithRsvp,
          ...initialPolaroidsRef.current,
        ];

        // Set the state with the combined photos
        setPolaroids(shuffleArray(combinedPhotos));
      } else {
        setPolaroids(initialPolaroidsRef.current);
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // Fall back to initial polaroids if there's an error
      setPolaroids(initialPolaroidsRef.current);
    } finally {
      setLoading(false);
    }
  };

  // Update the ref when initialPolaroids changes
  useEffect(() => {
    initialPolaroidsRef.current = initialPolaroids;
    // If initialPolaroids changes, update the state
    setPolaroids((prevPolaroids) => {
      // If we already have photos from the API, keep them and just update the static ones
      if (prevPolaroids.length > initialPolaroids.length) {
        // Use strict equality check
        const apiPhotos = prevPolaroids.filter(
          (photo) => photo.isRsvp === true
        );

        return shuffleArray([...apiPhotos, ...initialPolaroids]);
      }
      return initialPolaroids;
    });
  }, [initialPolaroids]);

  // Fetch photos on mount
  useEffect(() => {
    fetchPhotos();

    // Optionally set up a refresh interval
    const intervalId = setInterval(() => {
      fetchPhotos();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array since we're using the ref

  if (loading && polaroids.length === 0) {
    return <div className="text-center">Loading photos...</div>;
  }

  if (error && polaroids.length === 0) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Create a new array with explicit isRsvp values to pass to PolaroidCarousel
  const processedPolaroids = polaroids.map((p) => ({
    photoData: p.photoData,
    note: p.note,
    badge: p.badge,
    isRsvp: p.isRsvp === true,
  }));

  return <PolaroidCarousel polaroids={processedPolaroids} />;
}
