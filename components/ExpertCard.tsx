import Link from "next/link";
import type { ExpertWithProfile } from "@/lib/types";

export default function ExpertCard({ expert }: { expert: ExpertWithProfile }) {
  const profile = expert.profiles;

  return (
    <Link
      href={`/experts/${expert.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-brand-600 font-semibold text-lg">
              {profile.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {profile.full_name}
          </h3>
          <p className="text-sm text-gray-600 truncate">{expert.headline}</p>
          {expert.years_experience > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {expert.years_experience} years experience
            </p>
          )}
        </div>
      </div>

      {expert.former_companies.length > 0 && (
        <p className="text-xs text-gray-500 mt-3">
          Previously at{" "}
          <span className="font-medium text-gray-700">
            {expert.former_companies.slice(0, 3).join(", ")}
          </span>
        </p>
      )}

      {expert.industries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {expert.industries.slice(0, 3).map((industry) => (
            <span
              key={industry}
              className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded text-xs font-medium"
            >
              {industry}
            </span>
          ))}
        </div>
      )}

      {expert.expertise_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {expert.expertise_tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
