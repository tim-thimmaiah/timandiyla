"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import CameraCapture from "@/components/CameraCapture";
import PolaroidFrame from "@/components/PolaroidFrame";
import { usePhotoMemoryStore } from "@/lib/photoStore";
import { useRSVPStore } from "@/lib/rsvpStore";

export default function PhotoMemoryPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState<
    "intro" | "camera" | "note" | "preview" | "saving"
  >("intro");
  const [shouldShake, setShouldShake] = useState(false);

  // Get state and actions from our stores
  const {
    photoData,
    note,
    isSubmitting,
    isSubmitted,
    error,
    setPhotoData,
    setNote,
    setIsCapturing,
    resetPhotoMemory,
    savePhotoMemory,
  } = usePhotoMemoryStore();

  const { name, email } = useRSVPStore();

  // Fix hydration issues by only rendering on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle photo capture
  const handleCapture = (capturedPhotoData: string) => {
    setPhotoData(capturedPhotoData);
    setStep("note");
    // Trigger shake animation when reaching the note step
    setTimeout(() => {
      setShouldShake(true);
    }, 300);
  };

  // Handle camera cancel
  const handleCameraCancel = () => {
    setIsCapturing(false);
    setStep("intro");
  };

  // Handle note change
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setStep("saving");
    try {
      await savePhotoMemory();
      // Don't navigate here - let the useEffect handle it
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      // Stay on the saving step to show the error
    }
  };

  // Handle skip
  const handleSkip = () => {
    resetPhotoMemory();
    router.push("/registered");
  };

  // Reset shake state when leaving note step
  useEffect(() => {
    if (step !== "note") {
      setShouldShake(false);
    }
  }, [step]);

  // Watch for submission status changes
  useEffect(() => {
    if (isSubmitted) {
      console.log("Photo submitted successfully, navigating to /registered");
      // Add a small delay to ensure state is fully updated
      setTimeout(() => {
        router.push("/registered");
      }, 500);
    }
  }, [isSubmitted, router]);

  // Log RSVP data on mount
  useEffect(() => {
    console.log("RSVP data in photo-memory page:", { name, email });
  }, [name, email]);

  if (!isClient) {
    return null; // Prevent hydration issues
  }

  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl w-full">
          <div className="rounded-lg overflow-hidden">
            <div className="p-8">
              <div>
                <svg
                  className="h-[5vh] w-full mx-auto"
                  viewBox="0 0 535 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31.3411 18.3256V56L27.0775 52.6667C24.6744 55.4574 20.876 57.1628 17 57.1628C6.53488 57.1628 0.100773 46.3876 0.100773 28.7907C0.100773 11.2714 6.53488 0.573685 17 0.573685C23.124 0.573685 28.2403 4.37213 31.031 10.8062L23.8992 11.969C22.4263 9.17833 20.1008 7.70546 17 7.70546C11.8062 7.70546 8.93798 15.2248 8.93798 28.7907C8.93798 42.5116 11.8062 50.031 17 50.031C19.6356 50.031 21.6511 48.7132 22.6589 46.2326V25.4574H16.7674V18.3256H31.3411ZM38.4244 1.73647H47.1065V56H38.4244V1.73647ZM54.8518 1.73647H81.8285V8.86825H63.534V18.3256H75.627V25.4574H63.534V56H54.8518V1.73647ZM111.662 1.73647V8.86825H102.825V56H94.1426V8.86825H85.3054V1.73647H111.662ZM136.459 1.73647H145.141V39.0233C145.141 46.3876 147.544 50.4961 151.808 50.4961C156.071 50.4961 158.475 46.3876 158.475 39.0233V1.73647H167.157V39.0233C167.157 50.4186 161.42 57.2403 151.808 57.2403C142.195 57.2403 136.459 50.4186 136.459 39.0233V1.73647ZM198.774 10.4186C184.278 10.4186 191.565 56 169.317 56V47.3178C182.96 47.3178 175.829 1.73647 198.774 1.73647V10.4186ZM219.735 56L231.363 1.73647H238.805L250.432 56H241.75L239.192 44.062H230.975L228.417 56H219.735ZM232.525 36.9302H237.642L235.084 24.7597L232.525 36.9302ZM274.465 1.73647H282.527L296.79 34.9923L311.054 1.73647H319.116V56H310.434V22.7442L296.713 52.5116L283.147 22.8993V56H274.465V1.73647ZM325.337 1.73647H352.313V8.86825H334.019V36.9302H346.112V44.062H334.019V48.8682H352.313V56H325.337V1.73647ZM357.889 1.73647H365.951L380.214 16.0775L394.478 1.73647H402.54V56H393.858V13.0543L380.137 25.9225L366.571 13.2093V56H357.889V1.73647ZM436.34 57.2403C420.681 57.2403 407.967 44.5271 407.967 28.8682C407.967 13.1318 420.681 0.496167 436.34 0.496167C452.076 0.496167 464.712 13.1318 464.712 28.8682C464.712 44.5271 452.076 57.2403 436.34 57.2403ZM436.34 48.5581C447.27 48.5581 456.029 39.7209 456.029 28.8682C456.029 17.938 447.27 9.17833 436.34 9.17833C425.487 9.17833 416.65 17.938 416.65 28.8682C416.65 39.7209 425.487 48.5581 436.34 48.5581ZM483.411 36.9302C491.628 36.9302 496.59 31.3489 496.59 22.2016C496.59 13.907 491.628 8.86825 483.411 8.86825H478.838V36.9302H483.411ZM470.156 56V1.73647H483.411C496.59 1.73647 505.272 9.876 505.272 22.2016C505.272 31.969 500.543 39.2558 492.791 42.3566L504.729 56H494.497L484.031 44.062H483.411H478.838V56H470.156ZM505.966 1.73647H515.113L520.152 23.9845L525.191 1.73647H534.338L524.493 39.1783V56H515.811V39.1783L505.966 1.73647Z"
                    fill="#DA4D73"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-regular italic text-redz-700 py-6 text-center font-serif">
                {/* {step === "intro" && "Capture a Memory"} */}
                {/* {step === "camera" && "Take a Photo"} */}
                {/* {step === "note" && "Add a Note"} */}
                {/* {step === "preview" && "Your Polaroid Memory"} */}
              </h1>
              {step === "intro" && (
                <div className="space-y-6 font-serif max-w-lg mx-auto relative">
                  <div className="mt-0">
                    <p className="text-2xl text-center pb-4">
                      Would you like to add a polaroid for our website photo
                      album? (You can also do this later.)
                    </p>

                    <div className="flex flex-col items-center space-y-4 mt-8">
                      <button
                        onClick={() => {
                          setIsCapturing(true);
                          setStep("camera");
                        }}
                        className="px-6 py-4 font-medium text-xl bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors w-full max-w-xs cursor-pointer"
                      >
                        take a photo
                      </button>

                      <button
                        onClick={handleSkip}
                        className="px-6 py-4 bg-transparent text-redz-700 rounded-md hover:bg-redz-50 transition-colors w-full max-w-xs"
                      >
                        skip
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {step === "camera" && (
                <div className="space-y-6 relative">
                  <div className="mt-0">
                    <p className="text-center text-xl mb-4 font-serif italic">
                      Position you or your group in the frame and smile!
                    </p>

                    <CameraCapture
                      onCapture={handleCapture}
                      onCancel={handleCameraCancel}
                    />
                  </div>
                </div>
              )}
              {step === "note" && (
                <div className="space-y-6 font-serif italic max-w-4xl">
                  <div className="flex flex-col gap-8 items-center max-w-[350px] mx-auto relative">
                    <div className="relative w-full -top-10 aspect-3/4 -rotate-0">
                      <PolaroidFrame
                        id="unique-id"
                        photoData={photoData}
                        note={note}
                        triggerShake={shouldShake}
                        onShake={() => setShouldShake(false)}
                        isLast={true}
                        setIsDragging={() => {}}
                        isDragging={false}
                        setCardDrivenProps={() => {}}
                        setIsDragOffBoundary={() => {}}
                        setDirection={() => {}}
                      />
                    </div>
                    <div className="w-full" style={{ maxWidth: "300px" }}>
                      <p className="mb-4 text-xl font-serif italic">
                        Add a note to your photo memory:
                      </p>
                      <textarea
                        value={note}
                        onChange={handleNoteChange}
                        className="w-full px-4 py-3 border-2 border-redz-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-redz-300 focus:ring-offset-chardon-50 font-handwriting text-lg"
                        placeholder="Write your message here..."
                        rows={3}
                        maxLength={150}
                      ></textarea>

                      <p className="text-sm text-gray-500 mt-2 font-serif italic">
                        {note.length}/150 characters
                      </p>

                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => {
                            setStep("camera");
                          }}
                          className="px-4 py-2 bg-transparent text-redz-700 rounded-md hover:bg-redz-50 transition-colors"
                        >
                          back
                        </button>

                        <button
                          onClick={() => setStep("preview")}
                          className="px-6 py-3 text-xl bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors"
                        >
                          preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {step === "preview" && (
                <div className="space-y-8 font-serif italic">
                  <div className="flex flex-col gap-8 items-center max-w-[450px] mx-auto relative">
                    <div className="relative w-full -top-10 aspect-3/4 -rotate-4">
                      <PolaroidFrame
                        id="unique-id"
                        photoData={photoData}
                        note={note}
                        isLast={true}
                        setIsDragging={() => {}}
                        isDragging={false}
                        setCardDrivenProps={() => {}}
                        setIsDragOffBoundary={() => {}}
                        setDirection={() => {}}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setStep("note")}
                      className="px-4 py-2 bg-transparent text-redz-700 rounded-md hover:bg-redz-50 transition-colors"
                    >
                      edit
                    </button>

                    <button
                      onClick={handleSubmit}
                      className="px-6 py-3 text-xl bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors"
                      disabled={isSubmitting}
                    >
                      finish
                    </button>
                  </div>
                </div>
              )}
              {step === "saving" && (
                <div className="space-y-8 font-serif italic text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-t-4 border-redz-700 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-xl">Saving your photo memory...</p>
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                        {error}
                        <button
                          onClick={() => setStep("preview")}
                          className="block mt-2 px-4 py-2 bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors mx-auto"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center font-serif italic">
            <Link href="/" className="text-redz-400 hover:underline">
              go back home
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
