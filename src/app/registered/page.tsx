"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import PolaroidFrame from "@/components/PolaroidFrame";
import { useRSVPStore } from "@/lib/rsvpStore";
import { usePhotoMemoryStore } from "@/lib/photoStore";

export default function RegisteredPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { name, email, guests, message, isSubmitted } = useRSVPStore();
  const { photoData, note } = usePhotoMemoryStore();

  // Redirect to RSVP page if no submission was made
  useEffect(() => {
    setIsClient(true);
    if (!name && !isSubmitted) {
      router.push("/rsvp");
    }
  }, [name, isSubmitted, router]);

  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-serif italic">
        <main className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-bold mb-8">
            <svg
              className="h-[8vh] mx-auto"
              viewBox="0 0 323 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.907 1.73647V8.86825H18.0698V56H9.38759V8.86825H0.550386V1.73647H26.907ZM31.9457 1.73647H40.6279V18.3256H53.9612V1.73647H62.6434V18.3256H70.2403C72.3333 7.93802 80.0852 1.73647 91.7131 1.73647H100.395V56H91.7131V25.4574H78.3798V56H69.6976V25.4574H62.6434V56H53.9612V25.4574H40.6279V56H31.9457V1.73647ZM79.155 18.3256H91.7131V9.64344C85.0464 9.64344 80.7829 12.6667 79.155 18.3256ZM108.178 1.73647H116.24L130.194 34.2171V1.73647H138.876V56H130.814L116.86 23.5194V56H108.178V1.73647ZM146.635 1.73647H155.317V13.9845L167.565 1.73647H177.953L164.619 15.0698L177.953 56H169.658L158.34 21.3489L155.317 24.3721V56H146.635V1.73647ZM201.219 1.73647H210.367L215.405 23.9845L220.444 1.73647H229.592L219.747 39.1783V56H211.064V39.1783L201.219 1.73647ZM257.562 57.2403C241.903 57.2403 229.19 44.5271 229.19 28.8682C229.19 13.1318 241.903 0.496167 257.562 0.496167C273.298 0.496167 285.934 13.1318 285.934 28.8682C285.934 44.5271 273.298 57.2403 257.562 57.2403ZM257.562 48.5581C268.492 48.5581 277.252 39.7209 277.252 28.8682C277.252 17.938 268.492 9.17833 257.562 9.17833C246.709 9.17833 237.872 17.938 237.872 28.8682C237.872 39.7209 246.709 48.5581 257.562 48.5581ZM291.378 1.73647H300.06V39.0233C300.06 46.3876 302.463 50.4961 306.727 50.4961C310.99 50.4961 313.394 46.3876 313.394 39.0233V1.73647H322.076V56H317.58L316.262 52.9767C313.936 55.6899 310.448 57.2403 306.727 57.2403C297.114 57.2403 291.378 50.4186 291.378 39.0233V1.73647Z"
                fill="#DA4D73"
              />
            </svg>
          </h1>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col items-center">
              <p className="text-xl mb-2">
                {name}
                {guests && guests.length > 0 && (
                  <>
                    {guests.length === 1 ? " and " : ", "}
                    {guests.length > 1 &&
                      guests.slice(0, -1).map((guest, index) => (
                        <span key={guest}>
                          {guest}
                          {index < guests.length - 2 ? ", " : ""}
                        </span>
                      ))}
                    {guests.length > 1 && " and "}
                    {guests[guests.length - 1]}
                  </>
                )}
              </p>
            </div>
            <p className="text-xl mb-4">~ we can't wait to see you ~</p>
            {isClient && photoData && (
              <div className="flex flex-col gap-8 items-center max-w-[350px] mx-auto relative mt-12">
                <div className="relative w-full -top-10 aspect-3/4 rotate-4">
                  <PolaroidFrame
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
            )}
          </div>
          <div className="mt-8">
            <Link
              href="/event"
              className="px-6 py-3 bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors"
            >
              view event details
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
