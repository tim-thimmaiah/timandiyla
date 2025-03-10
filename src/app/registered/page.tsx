"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import RSVPConfirmation from "@/components/RSVPConfirmation";
import { useRSVPStore } from "@/lib/rsvpStore";

export default function RegisteredPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { name, isSubmitted } = useRSVPStore();

  // Redirect to RSVP page if no submission was made
  useEffect(() => {
    setIsClient(true);
    if (!name && !isSubmitted) {
      router.push("/rsvp");
    }
  }, [name, isSubmitted, router]);

  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-bold mb-8">Thank You!</h1>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mb-8">
            <p className="text-xl mb-4">Your RSVP has been received.</p>
            <p className="mb-6">
              We&apos;re excited to celebrate our special day with you!
            </p>

            {isClient && <RSVPConfirmation />}

            <p className="text-sm text-gray-600 mt-6">
              A confirmation email has been sent to your provided email address.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
