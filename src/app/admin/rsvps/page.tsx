"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

type RSVP = {
  id: string;
  name: string;
  email: string;
  guests: string[];
  message: string;
  created_at: string;
};

export default function AdminRSVPsPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRSVPs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("rsvps")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setRsvps(data || []);
      } catch (error) {
        console.error("Error fetching RSVPs:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching RSVPs"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRSVPs();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen p-8">
        <main className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-redz-700">
            RSVP Responses
          </h1>

          <div className="mb-6 flex justify-between items-center">
            <Link
              href="/admin/photos"
              className="text-redz-700 hover:underline"
            >
              Manage Photos
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading RSVPs...</div>
          ) : rsvps.length === 0 ? (
            <div className="text-center py-8">No RSVPs submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-redz-50">
                    <th className="p-3 text-left border border-redz-200">
                      Name
                    </th>
                    <th className="p-3 text-left border border-redz-200">
                      Email
                    </th>
                    <th className="p-3 text-left border border-redz-200">
                      Guests
                    </th>
                    <th className="p-3 text-left border border-redz-200">
                      Message
                    </th>
                    <th className="p-3 text-left border border-redz-200">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-redz-50">
                      <td className="p-3 border border-redz-200">
                        {rsvp.name}
                      </td>
                      <td className="p-3 border border-redz-200">
                        {rsvp.email}
                      </td>
                      <td className="p-3 border border-redz-200">
                        {rsvp.guests && rsvp.guests.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {rsvp.guests.map((guest, index) => (
                              <li key={index}>{guest}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">No guests</span>
                        )}
                      </td>
                      <td className="p-3 border border-redz-200">
                        {rsvp.message || (
                          <span className="text-gray-400">No message</span>
                        )}
                      </td>
                      <td className="p-3 border border-redz-200">
                        {new Date(rsvp.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8">
            <Link href="/" className="text-redz-700 hover:underline">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
