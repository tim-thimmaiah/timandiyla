import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details | Tim & Iyla's Wedding",
  description:
    "Details about Tim & Iyla's wedding events in Oakland, California. July 4-5, 2025.",
  openGraph: {
    title: "Event Details | Tim & Iyla's Wedding",
    description:
      "Details about Tim & Iyla's wedding events in Oakland, California. July 4-5, 2025.",
    images: ["/og-image.jpg"],
    type: "website",
  },
};

export default function EventPage() {
  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-serif italic">
        <main className="max-w-4xl w-full">
          <div className="py-4 mb-12">
            <svg
              className="h-[6vh] md:h-[6vh] mx-auto"
              viewBox="0 0 397 66"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.875966 1.73647H27.8527V8.86825H9.55813V36.9302H21.6511V44.062H9.55813V48.8682H27.8527V56H0.875966V1.73647ZM40.8953 56L29.2674 1.73647H37.3294L44.6162 35.845L51.9031 1.73647H59.9651L48.3372 56H40.8953ZM63.1034 1.73647H90.0801V8.86825H71.7856V36.9302H83.8786V44.062H71.7856V48.8682H90.0801V56H63.1034V1.73647ZM103.097 1.73647C109.531 1.73647 114.338 4.99228 117.671 10.8838V1.73647H126.353V56H117.671C117.671 27.4729 113.562 12.6667 104.338 9.02329V56H95.6554V1.73647H103.097ZM159.712 1.73647V8.86825H149.557L140.797 56H132.115L140.875 8.86825H130.255V1.73647H159.712ZM202.765 1.73647C220.595 1.73647 231.758 12.2016 231.758 28.8682C231.758 45.4574 220.595 55.9225 202.765 55.9225V56H183.773V1.73647H202.765ZM192.455 48.8682H202.765C215.789 48.8682 223.075 41.6589 223.075 28.8682C223.075 16.0775 215.789 8.86825 202.765 8.86825H192.455V48.8682ZM235.629 1.73647H262.606V8.86825H244.311V36.9302H256.404V44.062H244.311V48.8682H262.606V56H235.629V1.73647ZM294.614 1.73647V8.86825H284.459L275.699 56H267.017L275.776 8.86825H265.156V1.73647H294.614ZM287.64 56L299.268 1.73647H306.71L318.338 56H309.655L307.097 44.062H298.88L296.322 56H287.64ZM300.431 36.9302H305.547L302.989 24.7597L300.431 36.9302ZM322.539 14.1396H331.221V56H322.539V14.1396ZM322.384 0.418649H331.377V9.41089H322.384V0.418649ZM337.298 1.73647H345.98V49.1008C362.104 50.4186 369.623 58.1705 381.871 58.1705V65.3023C365.282 65.3023 356.755 56 337.298 56V1.73647ZM396.585 10.4186C382.089 10.4186 389.376 56 367.127 56V47.3178C380.771 47.3178 373.639 1.73647 396.585 1.73647V10.4186Z"
                fill="#DA4D73"
              />
            </svg>
          </div>
          <div className="p-8 rounded-lg max-w-lg mx-auto border-2 border-redz-200 relative mb-12">
            <div className="bg-chardon-50 rounded-lg p-4 absolute -top-10 left-[20px] z-10 w-fit mx-auto block h-12 text-center">
              <h1 className="text-3xl font-semibold relative">
                {`July 4th, 2025`}
              </h1>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-0">Wedding Day</h2>
              <p className="mb-2 text-lg">
                {`Our wedding ceremony will be held in our backyard garden.`}
              </p>
              <div className="flex pt-4">
                <div>
                  <strong>Time:</strong>
                </div>
                <div className=" pl-4 mb-4">
                  Please arrive by <b>2:00 P.M.</b>. Our reception, ceremony,
                  and dinner will conclude by <b>7 P.M.</b>
                </div>
              </div>
              <p className="mb-0">
                <strong>Location:</strong> 418 45th St, Oakland, CA 94609
              </p>
            </div>
            <div className="mb-0">
              <h2 className="text-2xl font-semibold mb-4">After Party</h2>
              <p className="mb-2">
                {`We will be having an after party at a local venue nearby.`}
              </p>
              <p className="mb-2">
                <strong>Time:</strong> We will be leaving our home to the after
                party venue around <b>7:30 P.M.</b>
              </p>
              <p className="mb-2">
                <strong>Location:</strong> The location is still being
                finalized.
              </p>
            </div>
          </div>
          <div className="p-8 rounded-lg max-w-lg mx-auto mb-8 border-2 border-redz-200 relative">
            <div className="bg-chardon-50 rounded-lg p-4 absolute -top-10 left-[20px] z-10 w-fi mx-auto block h-12 text-center">
              <h1 className="text-3xl font-semibold relative text-left">
                {`July 5th, 2025`}
              </h1>
            </div>
            <div className="mb-0">
              <h2 className="text-xl font-semibold mb-0">Brunch</h2>
              <p className="mb-2 text-lg">
                {`Roll into day two! We are hosting a variety of local bands to host our own mini music festival in our backyard.`}
              </p>
              <div className="flex pt-4">
                <div>
                  <strong>Time:</strong>
                </div>
                <div className=" pl-4 mb-4">
                  Please arrive around <b>12:00 P.M.</b>.
                </div>
              </div>
              <p className="mb-0">
                <strong>Special note:</strong> This event is BYOPB - bring your
                own picnic blanket.
              </p>
              <p className="mb-0">
                <strong>Location:</strong> 418 45th St, Oakland, CA 94609
              </p>
            </div>
          </div>
        </main>
        <footer className="mt-6 md:mt-4 pt-0 md:pt-0 text-center text-sm text-[#A0304F]">
          <nav className="flex flex-wrap justify-center gap-4 mt-6 md:mt-8">
            <Link
              href="/"
              className="px-4 md:px-6 py-2 md:py-3 transition-colors underline underline-offset-4 hover:text-[#A0304F]"
            >
              Back Home
            </Link>
            <Link
              href="/faq"
              className="px-4 md:px-6 py-2 md:py-3 transition-colors underline underline-offset-4 hover:text-[#A0304F]"
            >
              FAQ
            </Link>
          </nav>
        </footer>
      </div>
    </PageTransition>
  );
}
