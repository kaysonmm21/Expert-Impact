import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Expert guidance,{" "}
            <span className="text-brand-600">completely free</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Retired business professionals share their decades of experience
            with startups and non-profits who need it most. No fees, no
            strings — just impact.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup/expert"
              className="bg-brand-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-brand-700 transition-colors w-full sm:w-auto"
            >
              Share Your Expertise
            </Link>
            <Link
              href="/experts"
              className="bg-white text-brand-600 border border-brand-200 px-8 py-3 rounded-lg text-base font-medium hover:bg-brand-50 transition-colors w-full sm:w-auto"
            >
              Find an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Experts sign up
              </h3>
              <p className="text-gray-600 text-sm">
                Retired professionals create a profile sharing their industry
                experience, expertise areas, and availability for pro-bono
                sessions.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seekers browse & book
              </h3>
              <p className="text-gray-600 text-sm">
                Entrepreneurs and non-profits search the directory, find the
                right expert, and request a free 30-minute session.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Meet & make impact
              </h3>
              <p className="text-gray-600 text-sm">
                Connect over Zoom or Google Meet. Experts share wisdom, seekers
                get the guidance they need, and everyone wins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Each User Type */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-brand-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                For Retired Professionals
              </h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">&#10003;</span>
                  Share decades of experience with those who need it
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">&#10003;</span>
                  Flexible scheduling — give as much or as little time as you want
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">&#10003;</span>
                  Find renewed purpose and meaningful connections
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">&#10003;</span>
                  Build your legacy of giving back
                </li>
              </ul>
              <Link
                href="/signup/expert"
                className="mt-6 inline-block bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                Join as an Expert
              </Link>
            </div>
            <div className="bg-green-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                For Startups & Non-Profits
              </h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">&#10003;</span>
                  Access world-class expertise at zero cost
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">&#10003;</span>
                  Get advice from former executives at top companies
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">&#10003;</span>
                  Browse experts by industry, expertise, and experience
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">&#10003;</span>
                  Book sessions in minutes, meet over video
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/signup/entrepreneur"
                  className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  I'm a Startup
                </Link>
                <Link
                  href="/signup/ngo"
                  className="inline-block bg-white text-green-700 border border-green-200 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  I'm a Non-Profit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            Expert Network — Connecting experience with opportunity.
          </p>
          <p className="text-xs mt-2">
            A pro-bono platform for retired professionals and budget-constrained organizations.
          </p>
        </div>
      </footer>
    </div>
  );
}
