import type User from "../../types/User";

interface HeroBannerProps {
  user: User | null;
  filteredToursCount: number;
  onExploreClick: () => void;
}

const getToursMessage = (count: number) => {
  if (count === 0) {
    return "Explore our tours below.";
  }

  if (count === 1) {
    return "We have 1 tour waiting for you.";
  }

  return `We have ${count} tours waiting for you.`;
};

export function HeroBanner({
  user,
  filteredToursCount,
  onExploreClick,
}: HeroBannerProps) {
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600 px-4 py-12 sm:py-16"
      aria-labelledby="hero-title"
    >
      {/* Decorative content: screen readers should ignore it */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white" />
      </div>

      <div className="relative mx-auto max-w-7xl text-center">
        {user ? (
          <>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-teal-200">
              Welcome back
            </p>

            <h1
              id="hero-title"
              className="mb-3 text-3xl font-extrabold text-white sm:text-4xl"
            >
              Hey, {firstName}! 👋
            </h1>

            <p className="mx-auto max-w-xl text-lg text-teal-100">
              Ready for your next adventure? {getToursMessage(filteredToursCount)}
            </p>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-teal-200">
              Explore the world
            </p>

            <h1
              id="hero-title"
              className="mb-3 text-3xl font-extrabold text-white sm:text-4xl"
            >
              Find Your Perfect Adventure
            </h1>

            <p className="mx-auto max-w-xl text-lg text-teal-100">
              Discover breathtaking tours led by expert guides. Your journey starts here.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                id="hero-explore-btn"
                type="button"
                onClick={onExploreClick}
                className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-7 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-700"
              >
                Explore Tours
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}