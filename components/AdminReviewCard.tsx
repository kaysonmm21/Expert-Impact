"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PendingExpert {
  id: string;
  full_name: string;
  email: string;
  bio: string | null;
  created_at: string;
  expert_profile: {
    headline: string;
    industries: string[];
    expertise_tags: string[];
    years_experience: number;
    former_companies: string[];
    linkedin_url: string | null;
  };
}

export default function AdminReviewCard({
  expert,
}: {
  expert: PendingExpert;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleAction(status: "approved" | "rejected") {
    setLoading(true);
    await supabase
      .from("profiles")
      .update({ status })
      .eq("id", expert.id);
    router.refresh();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-brand-600 font-semibold text-sm">
                {expert.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {expert.full_name}
              </h3>
              <p className="text-xs text-gray-500">{expert.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-700 font-medium mt-3">
            {expert.expert_profile.headline}
          </p>

          {expert.bio && (
            <p className="text-sm text-gray-500 mt-2">{expert.bio}</p>
          )}

          {expert.expert_profile.former_companies.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium">Companies:</span>{" "}
              {expert.expert_profile.former_companies.join(", ")}
            </p>
          )}

          {expert.expert_profile.years_experience > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Experience:</span>{" "}
              {expert.expert_profile.years_experience} years
            </p>
          )}

          {expert.expert_profile.industries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {expert.expert_profile.industries.map((industry) => (
                <span
                  key={industry}
                  className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded text-xs font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          )}

          {expert.expert_profile.expertise_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {expert.expert_profile.expertise_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {expert.expert_profile.linkedin_url && (
            <a
              href={expert.expert_profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline text-xs mt-2 inline-block"
            >
              View LinkedIn
            </a>
          )}

          <p className="text-xs text-gray-400 mt-3">
            Applied{" "}
            {new Date(expert.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => handleAction("approved")}
            disabled={loading}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction("rejected")}
            disabled={loading}
            className="bg-red-50 text-red-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
