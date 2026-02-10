import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";

export default async function BookExpertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get expert info
  const { data: expert } = await supabase
    .from("expert_profiles")
    .select("*, profiles!inner(*)")
    .eq("id", id)
    .eq("profiles.status", "approved")
    .single();

  if (!expert) {
    notFound();
  }

  const profile = expert.profiles as { full_name: string };

  // Get current user's seeker profile (if any)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let seekerId: string | null = null;
  if (user) {
    const { data: seekerProfile } = await supabase
      .from("seeker_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    seekerId = seekerProfile?.id || null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/experts/${id}`}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
      >
        &larr; Back to profile
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Request a Session
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Book a free 30-minute consultation with{" "}
          <span className="font-medium text-gray-700">
            {profile.full_name}
          </span>
        </p>

        <BookingForm
          expertId={id}
          expertName={profile.full_name}
          seekerId={seekerId}
        />
      </div>
    </div>
  );
}
