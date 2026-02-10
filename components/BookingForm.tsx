"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  expertId: string;
  expertName: string;
  seekerId: string | null;
}

export default function BookingForm({
  expertId,
  expertName,
  seekerId,
}: BookingFormProps) {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  if (!seekerId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 text-sm">
          You need to be logged in as an entrepreneur or non-profit to book a
          session.
        </p>
        <a
          href="/login"
          className="text-brand-600 hover:underline text-sm mt-2 inline-block"
        >
          Log in or sign up
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const scheduledAt = new Date(`${date}T${time}`).toISOString();

    const { error: bookingError } = await supabase.from("bookings").insert({
      expert_id: expertId,
      seeker_id: seekerId,
      scheduled_at: scheduledAt,
      topic,
      status: "requested",
      duration_minutes: 30,
    });

    if (bookingError) {
      setError(bookingError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-green-800 mb-1">
          Session Requested!
        </h3>
        <p className="text-green-700 text-sm">
          Your request has been sent to {expertName}. You&apos;ll be notified
          when they confirm.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-brand-600 hover:underline text-sm"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Get tomorrow as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What would you like to discuss?
        </label>
        <textarea
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="Briefly describe your question or topic..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            required
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Time
          </label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Sessions are 30 minutes. The expert will confirm or suggest an
        alternative time.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Sending request..." : "Request Session"}
      </button>
    </form>
  );
}
