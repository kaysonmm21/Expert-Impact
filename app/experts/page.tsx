import { createClient } from "@/lib/supabase/server";
import ExpertCard from "@/components/ExpertCard";
import ExpertFilters from "@/components/ExpertFilters";
import type { ExpertWithProfile } from "@/lib/types";

export default async function ExpertsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; industry?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("expert_profiles")
    .select("*, profiles!inner(*)")
    .eq("profiles.status", "approved");

  if (params.industry) {
    query = query.contains("industries", [params.industry]);
  }

  if (params.search) {
    const search = `%${params.search}%`;
    query = query.or(
      `headline.ilike.${search},profiles.full_name.ilike.${search},expertise_tags.cs.{${params.search}},former_companies.cs.{${params.search}}`
    );
  }

  const { data: experts } = await query.order("created_at", {
    referencedTable: "profiles",
    ascending: false,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Experts</h1>
        <p className="text-gray-500 text-sm mt-1">
          Find retired professionals ready to share their expertise for free
        </p>
      </div>

      <ExpertFilters />

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(experts as ExpertWithProfile[] | null)?.map((expert) => (
          <ExpertCard key={expert.id} expert={expert} />
        ))}
      </div>

      {(!experts || experts.length === 0) && (
        <div className="text-center py-16">
          <p className="text-gray-500">
            No experts found matching your criteria.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
