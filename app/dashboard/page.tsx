import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import BookingList from "@/components/BookingList";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const isExpert = profile.role === "expert";
  const isAdmin = await checkAdmin(supabase, user.id);

  // Get bookings based on role
  let bookings: Array<{
    id: string;
    scheduled_at: string;
    duration_minutes: number;
    meeting_link: string | null;
    status: string;
    topic: string;
    notes: string | null;
    counterpart_name: string;
    counterpart_headline?: string;
  }> = [];

  if (isExpert) {
    // Get expert's bookings
    const { data: expertProfile } = await supabase
      .from("expert_profiles")
      .select("id, meeting_link")
      .eq("profile_id", user.id)
      .single();

    if (expertProfile) {
      const { data: rawBookings } = await supabase
        .from("bookings")
        .select(
          "*, seeker:seeker_profiles(*, profiles(*))"
        )
        .eq("expert_id", expertProfile.id)
        .order("scheduled_at", { ascending: true });

      bookings = (rawBookings || []).map((b: Record<string, unknown>) => {
        const seeker = b.seeker as Record<string, unknown> | null;
        const seekerProfile = seeker?.profiles as Record<string, unknown> | null;
        return {
          id: b.id as string,
          scheduled_at: b.scheduled_at as string,
          duration_minutes: b.duration_minutes as number,
          meeting_link: (b.meeting_link || expertProfile.meeting_link) as string | null,
          status: b.status as string,
          topic: b.topic as string,
          notes: b.notes as string | null,
          counterpart_name: (seekerProfile?.full_name || "Unknown") as string,
          counterpart_headline: (seeker?.organization_name || "") as string,
        };
      });
    }
  } else {
    // Get seeker's bookings
    const { data: seekerProfile } = await supabase
      .from("seeker_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (seekerProfile) {
      const { data: rawBookings } = await supabase
        .from("bookings")
        .select(
          "*, expert:expert_profiles(*, profiles(*))"
        )
        .eq("seeker_id", seekerProfile.id)
        .order("scheduled_at", { ascending: true });

      bookings = (rawBookings || []).map((b: Record<string, unknown>) => {
        const expert = b.expert as Record<string, unknown> | null;
        const expertProfile = expert?.profiles as Record<string, unknown> | null;
        return {
          id: b.id as string,
          scheduled_at: b.scheduled_at as string,
          duration_minutes: b.duration_minutes as number,
          meeting_link: (b.meeting_link || expert?.meeting_link) as string | null,
          status: b.status as string,
          topic: b.topic as string,
          notes: b.notes as string | null,
          counterpart_name: (expertProfile?.full_name || "Unknown") as string,
          counterpart_headline: (expert?.headline || "") as string,
        };
      });
    }
  }

  const pendingBookings = bookings.filter((b) => b.status === "requested");
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed");
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {profile.full_name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Admin Panel
            </Link>
          )}
          {!isExpert && (
            <Link
              href="/experts"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Browse Experts
            </Link>
          )}
        </div>
      </div>

      {/* Expert pending review notice */}
      {isExpert && profile.status === "pending_review" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm font-medium">
            Your profile is pending review
          </p>
          <p className="text-yellow-700 text-xs mt-1">
            An admin will review your application. Once approved, you&apos;ll
            appear in the expert directory and can receive booking requests.
          </p>
        </div>
      )}

      {isExpert && profile.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">
            Your application was not approved
          </p>
          <p className="text-red-700 text-xs mt-1">
            Unfortunately your profile was not approved at this time. Please
            contact us if you have questions.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {pendingBookings.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isExpert ? "Pending Requests" : "Pending"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-brand-600">
            {upcomingBookings.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Upcoming</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">
            {pastBookings.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>
      </div>

      {/* Pending Requests (Expert view) */}
      {isExpert && pendingBookings.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Pending Requests
          </h2>
          <BookingList bookings={pendingBookings} role="expert" />
        </section>
      )}

      {/* Upcoming Sessions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Upcoming Sessions
        </h2>
        <BookingList
          bookings={upcomingBookings}
          role={isExpert ? "expert" : "seeker"}
        />
      </section>

      {/* Past Sessions */}
      {pastBookings.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Past Sessions
          </h2>
          <BookingList
            bookings={pastBookings}
            role={isExpert ? "expert" : "seeker"}
          />
        </section>
      )}
    </div>
  );
}

async function checkAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("admins")
    .select("id")
    .eq("id", userId)
    .single();
  return !!data;
}
