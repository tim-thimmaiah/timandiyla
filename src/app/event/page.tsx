import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function EventPage() {
  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8">Event Details</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ceremony</h2>
              <p className="mb-2"><strong>Date:</strong> [Wedding Date]</p>
              <p className="mb-2"><strong>Time:</strong> [Ceremony Time]</p>
              <p className="mb-2"><strong>Location:</strong> [Ceremony Venue]</p>
              <p><strong>Address:</strong> [Ceremony Address]</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Reception</h2>
              <p className="mb-2"><strong>Time:</strong> [Reception Time]</p>
              <p className="mb-2"><strong>Location:</strong> [Reception Venue]</p>
              <p><strong>Address:</strong> [Reception Address]</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Accommodations</h2>
              <p className="mb-4">We&apos;ve reserved a block of rooms at the following hotels:</p>
              <ul className="list-disc pl-5 mb-4">
                <li className="mb-2">[Hotel Name 1] - [Hotel Address 1]</li>
                <li>[Hotel Name 2] - [Hotel Address 2]</li>
              </ul>
              <p>Please mention our wedding when booking to receive the special rate.</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-black hover:underline">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
