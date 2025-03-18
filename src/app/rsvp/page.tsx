"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import { useRSVPStore } from "@/lib/rsvpStore";

export default function RSVPPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Get state and actions from our store
  const {
    name,
    email,
    guests,
    message,
    isSubmitting,
    isSubmitted,
    error,
    setName,
    setEmail,
    addGuest,
    updateGuest,
    removeGuest,
    setMessage,
    submitForm,
  } = useRSVPStore();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  // Watch for isSubmitted changes and redirect when true
  useEffect(() => {
    if (isSubmitted && !error) {
      router.push("/photo-memory");
    }
  }, [isSubmitted, error, router]);

  // Fix hydration issues by only rendering form controls on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-serif italic">
        <main className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8">
            <svg
              className="h-[8vh] mx-auto"
              viewBox="0 0 131 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.1318 35.9302C22.3488 35.9302 27.3101 30.3489 27.3101 21.2016C27.3101 12.907 22.3488 7.86825 14.1318 7.86825H9.55813V35.9302H14.1318ZM0.875966 55V0.736474H14.1318C27.3101 0.736474 35.9922 8.876 35.9922 21.2016C35.9922 30.969 31.2635 38.2558 23.5116 41.3566L35.4496 55H25.217L14.7519 43.062H14.1318H9.55813V55H0.875966ZM66.4464 9.41864C51.9503 9.41864 59.2371 55 36.9891 55V46.3178C50.6325 46.3178 43.5007 0.736474 66.4464 0.736474V9.41864ZM79.655 55L68.0271 0.736474H76.0891L83.3759 34.845L90.6627 0.736474H98.7247L87.0968 55H79.655ZM102.999 55V0.736474H109.82C124.006 0.736474 130.906 4.37988 130.906 11.8993C130.906 19.8837 124.704 23.9148 111.681 24.3799V52.5194L111.603 55H102.999ZM111.681 17.2481C118.89 16.938 121.991 15.3876 121.991 11.8217C121.991 9.34112 118.89 8.10081 111.681 7.86825V17.2481Z"
                fill="#DA4D73"
              />
            </svg>
          </h1>
          <p className="text-center text-xl mb-12">
            Please let us know if you can make it to our special day.
          </p>

          <div className="p-8 rounded-lg max-w-2xl mx-auto">
            {isClient && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-chardon-100 text-redz-700 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-redz-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-redz-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-redz-300 focus:ring-offset-chardon-50"
                    placeholder="Your Name"
                    required
                    autoComplete="name"
                  />
                </div>
                <button
                  type="button"
                  onClick={addGuest}
                  className="w-full px-4 py-3 bg-chardon-100 text-redz-700 rounded-md hover:bg-chardon-200 transition-colors cursor-pointer"
                >
                  add additional guest
                </button>

                {guests.length > 0 && (
                  <div className="space-y-3">
                    {guests.map((guest, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={guest}
                          onChange={(e) => updateGuest(index, e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-redz-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-redz-300 focus:ring-offset-chardon-50"
                          placeholder="Guest Name"
                        />
                        <button
                          type="button"
                          onClick={() => removeGuest(index)}
                          className="p-2 text-redz-300 hover:text-redz-700 cursor-pointer"
                          aria-label="Remove guest"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-circle-minus cursor-pointer"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-redz-700 mb-2"
                  >
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-redz-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-redz-300 focus:ring-offset-chardon-50"
                    placeholder="your.email@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-redz-700 mb-2"
                  >
                    Dietary Restrictions or Preferences (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-redz-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-redz-300 focus:ring-offset-chardon-50"
                    placeholder="Please let us know of any dietary restrictions or preferences"
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-4 bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors disabled:bg-redz-100 w-full cursor-pointer"
                  >
                    {isSubmitting ? "submitting..." : "submit rsvp"}
                  </button>
                </div>
              </form>
            )}
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
              href="/event"
              className="px-4 md:px-6 py-2 md:py-3 transition-colors underline underline-offset-4 hover:text-[#A0304F]"
            >
              Event Details
            </Link>
          </nav>
        </footer>
      </div>
    </PageTransition>
  );
}
