"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { PolaroidItem } from "@/constants/polaroidData";

// Dynamically import the DynamicPolaroidCarousel with no SSR
// This ensures it only runs on the client side
const DynamicPolaroidCarousel = dynamic(
  () => import("@/components/DynamicPolaroidCarousel"),
  { ssr: false }
);

interface HomeContentProps {
  initialPhotos: PolaroidItem[];
}

export default function HomeContent({ initialPhotos }: HomeContentProps) {
  return (
    <>
      <h1 className="text-center text-xl mb-2">
        {`you're invited to celebrate`}
      </h1>
      <div className="py-4">
        <svg
          className="h-[8vh] md:h-[10vh] mx-auto"
          viewBox="0 0 297 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26.907 1.73647V8.86825H18.0698V56H9.38759V8.86825H0.550386V1.73647H26.907ZM31.9457 1.73647H40.6279V56H31.9457V1.73647ZM46.8591 1.73647H54.9211L69.1847 16.0775L83.4482 1.73647H91.5102V56H82.8281V13.0543L69.1071 25.9225L55.5413 13.2093V56H46.8591V1.73647ZM156.532 1.73647V8.86825H150.485C159.168 15.1473 164.206 23.5969 164.206 32.3566C164.206 38.6357 162.656 43.907 159.71 47.938C161.183 48.5581 162.734 48.8682 164.284 48.8682V56C160.796 56 157.54 54.9147 154.439 53.1318C150.563 55.7674 145.602 57.1628 139.788 57.1628C126.377 57.1628 118.005 48.5581 118.005 34.7597C118.005 26.3101 123.276 18.8682 131.881 14.9148C130.718 10.1086 130.175 5.61244 130.175 1.73647H156.532ZM125.912 36.1551C125.912 44.8372 130.796 50.031 139.4 50.031C142.889 50.031 145.834 49.4109 148.315 48.1705C142.113 41.7364 137.23 32.3566 134.129 22.9768C128.78 25.9225 125.912 30.4961 125.912 36.1551ZM139.323 8.86825C140.873 20.8837 145.989 35.7675 153.509 43.5969C155.369 40.8062 156.299 37.2403 156.299 33.0543C156.299 22.5117 150.33 14.5272 139.323 8.86825ZM191.606 14.1396H200.288V56H191.606V14.1396ZM191.451 0.418649H200.443V9.41089H191.451V0.418649ZM203.112 1.73647H212.259L217.298 23.9845L222.337 1.73647H231.484L221.639 39.1783V56H212.957V39.1783L203.112 1.73647ZM234.147 1.73647H242.829V49.1008C258.953 50.4186 266.473 58.1705 278.721 58.1705V65.3023C262.131 65.3023 253.604 56 234.147 56V1.73647ZM288.094 1.73647H296.777V56H288.094V25.4574H274.761V56H266.079V24.2171C266.079 10.2636 274.451 1.73647 288.094 1.73647ZM275.536 18.3256H288.094V9.64344C281.428 9.64344 277.164 12.6667 275.536 18.3256Z"
            fill="#DA4D73"
          />
        </svg>
      </div>
      <div className="mb-4">
        <div className="px-4 md:px-0 -top-10 relative">
          <DynamicPolaroidCarousel initialPolaroids={initialPhotos} />
        </div>
      </div>
      <div className="text-center text-sm">
        <h2 className="text-2xl">{`July 4  & July 5  2025`}</h2>
        <p className="text-xl ">{`Oakland, California`}</p>
      </div>
      <div className="py-4 text-center">
        <Link href="/rsvp">
          <button className="p-4 md:p-6 mx-auto min-w-[250px] md:min-w-[300px] text-white rounded-sm text-lg font-medium bg-[#A0304F] cursor-pointer hover:bg-[#A0304F]/80 transition-colors">{`rsvp`}</button>
        </Link>
      </div>
    </>
  );
}
