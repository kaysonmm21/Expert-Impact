import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: expert } = await supabase
    .from("expert_profiles")
    .select("*, profiles!inner(*)")
    .eq("id", id)
    .eq("profiles.status", "approved")
    .single();

  if (!expert) {
    notFound();
  }

  const profile = expert.profiles as {
    full_name: string;
    email: string;
    bio: string | null;
    avatar_url: string | null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/experts"
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
      >
        &larr; Back to directory
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {profile.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profile.full_name}
              </h1>
              <p className="text-brand-100 mt-1">{expert.headline}</p>
              {expert.years_experience > 0 && (
                <p className="text-brand-200 text-sm mt-1">
                  {expert.years_experience} years of experience
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {profile.bio && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                About
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {expert.former_companies.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                Former Companies
              </h2>
              <div className="flex flex-wrap gap-2">
                {expert.former_companies.map((company: string) => (
                  <span
                    key={company}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {expert.industries.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                Industries
              </h2>
              <div className="flex flex-wrap gap-2">
                {expert.industries.map((industry: string) => (
                  <span
                    key={industry}
                    className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}

          {expert.expertise_tags.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {expert.expertise_tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {expert.linkedin_url && (
            <div>
              <a
                href={expert.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 text-sm font-medium"
              >
                View LinkedIn Profile &rarr;
              </a>
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-gray-200 pt-8">
            <Link
              href={`/experts/${expert.id}/book`}
              className="inline-block bg-brand-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Request a Free Session
            </Link>
            <p className="text-gray-400 text-xs mt-2">
              30-minute pro-bono consultation via video call
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
