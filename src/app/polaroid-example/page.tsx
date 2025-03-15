"use client";

import React, { useState } from "react";
import PolaroidFrame from "@/components/PolaroidFrame";

export default function PolaroidExamplePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=2787&auto=format&fit=crop"
  );
  const [shakeCount, setShakeCount] = useState(0);
  const [lastShaken, setLastShaken] = useState<string | null>(null);

  const samplePhotos = [
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=2882&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551845041-63e8e76836ea?q=80&w=2689&auto=format&fit=crop",
    null,
  ];

  const sampleNotes = [
    "Our first date",
    "Summer vacation",
    "Remember this day",
    "Empty polaroid",
  ];

  const handleShake = (note: string) => {
    setShakeCount((prev) => prev + 1);
    setLastShaken(note);
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">CSS Polaroid Frame Example</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
        {/* Regular polaroid */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">Regular Polaroid</h2>
          <div className="w-full h-[400px]">
            <PolaroidFrame
              photoData={selectedPhoto}
              note="Our special day together"
              onShake={() => handleShake("Our special day together")}
            />
          </div>
        </div>

        {/* Preview polaroid */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">Preview Polaroid</h2>
          <div className="w-full h-[400px]">
            <PolaroidFrame
              photoData={selectedPhoto}
              note="Smaller preview version"
              isPreview={true}
              onShake={() => handleShake("Smaller preview version")}
            />
          </div>
        </div>
      </div>

      {/* Shake counter */}
      <div className="mt-8 p-4 bg-pink-50 rounded-lg text-center">
        <p className="text-lg">
          Polaroids shaken: <span className="font-bold">{shakeCount}</span>
        </p>
        {lastShaken && (
          <p className="text-sm mt-2">
            Last shaken:{" "}
            <span className="italic">&ldquo;{lastShaken}&rdquo;</span>
          </p>
        )}
      </div>

      {/* Sample gallery */}
      <h2 className="text-2xl font-bold mt-16 mb-6">Sample Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
        {samplePhotos.map((photo, index) => (
          <div
            key={index}
            className="h-[250px] cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <PolaroidFrame
              photoData={photo}
              note={sampleNotes[index]}
              isPreview={true}
              className={selectedPhoto === photo ? "ring-4 ring-pink-300" : ""}
              onShake={() => handleShake(sampleNotes[index])}
            />
          </div>
        ))}
      </div>

      <div className="mt-16 text-center max-w-lg">
        <p className="mb-4">
          This example demonstrates a pure CSS implementation of the Polaroid
          frame with 3D effects using CSS transforms and perspective.
        </p>
        <p className="mb-4">
          <strong>Interactions:</strong>
        </p>
        <ul className="text-left list-disc pl-6 mb-4">
          <li>Hover over polaroids to see the 3D tilt effect</li>
          <li>Double-click any polaroid to trigger the shake animation</li>
          <li>Click on the sample polaroids to change the main display</li>
        </ul>
      </div>
    </main>
  );
}
