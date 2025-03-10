"use client";

import { useRSVPStore } from "@/lib/rsvpStore";

export default function RSVPConfirmation() {
  const { name, email, guests, message } = useRSVPStore();

  if (!name || !email) {
    return (
      <div className="text-center">
        <p className="text-gray-600">No RSVP information available.</p>
      </div>
    );
  }

  // Count total attendees (primary person + guests)
  const totalAttendees =
    1 + guests.filter((guest) => guest.trim() !== "").length;

  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Your RSVP Details:</h2>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Your Name:</span> {name}
        </p>

        {guests.length > 0 && guests.some((guest) => guest.trim() !== "") && (
          <div>
            <p className="font-medium">Guests:</p>
            <ul className="list-disc pl-5 mt-1">
              {guests
                .filter((guest) => guest.trim() !== "")
                .map((guest, index) => (
                  <li key={index}>{guest}</li>
                ))}
            </ul>
          </div>
        )}

        <p>
          <span className="font-medium">Total Attendees:</span> {totalAttendees}
        </p>

        <p>
          <span className="font-medium">Contact Email:</span> {email}
        </p>

        {message && (
          <div>
            <p className="font-medium">Dietary Restrictions or Preferences:</p>
            <p className="italic mt-1 text-gray-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
