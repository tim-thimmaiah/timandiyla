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

      console.log("DynamicPolaroidCarousel: Starting to fetch photos from API");
      const response = await fetch("/api/photos");

      console.log(
        "DynamicPolaroidCarousel: API response status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch photos: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("DynamicPolaroidCarousel: API response data:", {
        hasPhotos: !!data.photos,
        photoCount: data.photos?.length || 0,
        error: data.error || "none",
      });

      if (data.photos && data.photos.length > 0) {
        console.log("DynamicPolaroidCarousel: First photo from API:", {
          photoUrl: data.photos[0].photoData?.substring(0, 50) + "...",
          note: data.photos[0].note,
          badge: data.photos[0].badge,
        });

        // Combine API photos with initial (static) photos and shuffle
        const combinedPhotos = [...data.photos, ...initialPolaroidsRef.current];
        console.log(
          `DynamicPolaroidCarousel: Combined ${data.photos.length} API photos with ${initialPolaroidsRef.current.length} static photos`
        );
        setPolaroids(shuffleArray(combinedPhotos));
      } else {
        console.log(
          "DynamicPolaroidCarousel: No photos returned from API, using initial polaroids only"
        );
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
        const apiPhotos = prevPolaroids.slice(
          0,
          prevPolaroids.length - initialPolaroids.length
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

  return <PolaroidCarousel polaroids={polaroids} />;
}
