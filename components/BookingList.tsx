"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface BookingItem {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link: string | null;
  status: string;
  topic: string;
  notes: string | null;
  counterpart_name: string;
  counterpart_headline?: string;
}

interface BookingListProps {
  bookings: BookingItem[];
  role: "expert" | "seeker";
}

const STATUS_STYLES: Record<string, string> = {
  requested: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

export default function BookingList({ bookings, role }: BookingListProps) {
  const supabase = createClient();
  const router = useRouter();

  async function updateBooking(id: string, status: string, meetingLink?: string) {
    const update: Record<string, unknown> = { status };
    if (meetingLink) update.meeting_link = meetingLink;

    await supabase.from("bookings").update(update).eq("id", id);
    router.refresh();
  }

  if (bookings.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        No sessions yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const date = new Date(booking.scheduled_at);
        return (
          <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">
                    {booking.counterpart_name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                {booking.counterpart_headline && (
                  <p className="text-xs text-gray-500 mb-1">
                    {booking.counterpart_headline}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Topic:</span> {booking.topic}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {date.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  {" · "}
                  {booking.duration_minutes} min
                </p>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                {booking.status === "confirmed" && booking.meeting_link && (
                  <a
                    href={booking.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-brand-700 transition-colors text-center"
                  >
                    Join Meeting
                  </a>
                )}

                {role === "expert" && booking.status === "requested" && (
                  <>
                    <button
                      onClick={() => {
                        updateBooking(booking.id, "confirmed");
                      }}
                      className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateBooking(booking.id, "cancelled")}
                      className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}

                {booking.status === "confirmed" && (
                  <button
                    onClick={() => updateBooking(booking.id, "completed")}
                    className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
