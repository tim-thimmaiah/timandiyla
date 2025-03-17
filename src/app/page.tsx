import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { polaroidData } from "@/constants/polaroidData";
import { fetchAllPhotos } from "@/lib/photoService";
import HomeContent from "@/components/HomeContent";

// Make the home page a Server Component to fetch initial photos at request time
export default async function Home() {
  // Fetch both static and user-submitted photos for initial render
  const initialPhotos = await fetchAllPhotos(polaroidData);

  return (
    <PageTransition>
      <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center font-serif italic">
        <div className="flex-grow"></div>
        <main className="max-w-4xl w-full">
          <HomeContent initialPhotos={initialPhotos} />
        </main>
        <footer className="mt-6 md:mt-4 pt-0 md:pt-0 text-center text-sm text-[#A0304F]">
          <nav className="flex flex-wrap justify-center gap-4 mt-6 md:mt-8">
            <Link
              href="/event"
              className="px-4 md:px-6 py-2 md:py-3 transition-colors underline underline-offset-4 hover:text-[#A0304F]"
            >
              Event Details
            </Link>
            <Link
              href="/photo-memory"
              className="px-4 md:px-6 py-2 md:py-3 transition-colors underline underline-offset-4 hover:text-[#A0304F]"
            >
              Add Photo
            </Link>
          </nav>
        </footer>
        <div className="flex-grow"></div>
      </div>
    </PageTransition>
  );
}
