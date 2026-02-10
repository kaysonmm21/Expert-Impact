"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const INDUSTRY_OPTIONS = [
  "Consumer Goods",
  "Technology",
  "Healthcare",
  "Finance",
  "Marketing",
  "Operations",
  "Manufacturing",
  "Retail",
  "Energy",
  "Education",
  "Real Estate",
  "Non-Profit",
];

export default function ExpertFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentIndustry = searchParams.get("industry") || "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/experts?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          defaultValue={currentSearch}
          onChange={(e) => {
            // Debounce search
            const value = e.target.value;
            const timer = setTimeout(() => updateParams("search", value), 300);
            return () => clearTimeout(timer);
          }}
          placeholder="Search by name, expertise, or company..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams("industry", "")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              !currentIndustry
                ? "bg-brand-100 text-brand-700 border-brand-300"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {INDUSTRY_OPTIONS.map((industry) => (
            <button
              key={industry}
              onClick={() => updateParams("industry", industry)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                currentIndustry === industry
                  ? "bg-brand-100 text-brand-700 border-brand-300"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
