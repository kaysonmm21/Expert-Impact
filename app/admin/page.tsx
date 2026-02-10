import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminReviewCard from "@/components/AdminReviewCard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check admin status
  const { data: adminRecord } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminRecord) {
    redirect("/dashboard");
  }

  // Get pending expert applications
  const { data: pendingProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "expert")
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  // Get expert profile data for each pending profile
  const pendingExperts = [];
  for (const profile of pendingProfiles || []) {
    const { data: expertProfile } = await supabase
      .from("expert_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .single();

    if (expertProfile) {
      pendingExperts.push({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        bio: profile.bio,
        created_at: profile.created_at,
        expert_profile: {
          headline: expertProfile.headline,
          industries: expertProfile.industries,
          expertise_tags: expertProfile.expertise_tags,
          years_experience: expertProfile.years_experience,
          former_companies: expertProfile.former_companies,
          linkedin_url: expertProfile.linkedin_url,
        },
      });
    }
  }

  // Get counts for stats
  const { count: approvedCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "expert")
    .eq("status", "approved");

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const { count: completedBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
      <p className="text-gray-500 text-sm mb-8">
        Review expert applications and monitor platform activity
      </p>

      {/* Platform Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {pendingExperts.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending Review</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {approvedCount || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Approved Experts</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-brand-600">
            {totalBookings || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {completedBookings || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed Sessions</p>
        </div>
      </div>

      {/* Pending Applications */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pending Expert Applications
        </h2>

        {pendingExperts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">
              No pending applications to review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingExperts.map((expert) => (
              <AdminReviewCard key={expert.id} expert={expert} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
