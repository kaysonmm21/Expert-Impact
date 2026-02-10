"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function ExpertSignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  // Step 1: Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Step 2: Professional info
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [expertiseTags, setExpertiseTags] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [formerCompanies, setFormerCompanies] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  function toggleIndustry(industry: string) {
    setIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError("");

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Failed to create account");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    // 2. Create profile + expert profile via SECURITY DEFINER function
    const { error: rpcError } = await supabase.rpc("create_expert_profile", {
      user_id: userId,
      user_email: email,
      user_full_name: fullName,
      user_bio: bio || "",
      expert_headline: headline,
      expert_industries: industries,
      expert_expertise_tags: expertiseTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      expert_years_experience: parseInt(yearsExperience) || 0,
      expert_former_companies: formerCompanies
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      expert_linkedin_url: linkedinUrl || null,
      expert_meeting_link: meetingLink || null,
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Join as an Expert
        </h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Share your professional experience with those who need it most
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1
                ? "bg-brand-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div className="w-12 h-0.5 bg-gray-200">
            <div
              className={`h-full transition-all ${
                step >= 2 ? "bg-brand-600 w-full" : "w-0"
              }`}
            />
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2
                ? "bg-brand-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="At least 6 characters"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="e.g. Former VP Marketing at P&G"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="Tell seekers about your background and what you can help with..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industries (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => toggleIndustry(industry)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        industries.includes(industry)
                          ? "bg-brand-100 text-brand-700 border-brand-300"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={expertiseTags}
                  onChange={(e) => setExpertiseTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="Go-to-market, Brand strategy, Supply chain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    placeholder="25"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Former Companies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formerCompanies}
                    onChange={(e) => setFormerCompanies(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    placeholder="P&G, Johnson & Johnson"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="https://linkedin.com/in/janesmith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (Zoom or Google Meet)
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  placeholder="https://zoom.us/j/your-meeting-id"
                />
              </div>
            </>
          )}

          <div className="flex gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : step === 1
                ? "Next"
                : "Create Expert Account"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
