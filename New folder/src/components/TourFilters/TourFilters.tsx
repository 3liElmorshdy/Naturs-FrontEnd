interface TourFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  difficulty: string;
  setDifficulty: (value: string) => void;

  minRating: number;
  setMinRating: (value: number) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  resultsCount: number;
  isFiltered: boolean;
  onClearFilters: () => void;

  isLocating: boolean;
  isNearMeActive: boolean;
  locationError: string | null;
  onNearMe: () => void;
  onClearNearMe: () => void;
}

export function TourFilters({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  resultsCount,
  isFiltered,
  onClearFilters,
  isLocating,
  isNearMeActive,
  locationError,
  onNearMe,
  onClearNearMe,
}: TourFiltersProps) {
  function handleNearMeClick() {
    if (isNearMeActive) {
      onClearNearMe();
      return;
    }

    onNearMe();
  }

  function handleClearAll() {
    onClearFilters();

    if (isNearMeActive) {
      onClearNearMe();
    }
  }

  return (
    <section className="sticky top-16 z-40 -mt-8">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>

              <input
                type="search"
                placeholder="Search tours..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                aria-label="Search tours"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Near me */}
            <button
              type="button"
              onClick={handleNearMeClick}
              disabled={isLocating}
              aria-pressed={isNearMeActive}
              title={
                isNearMeActive
                  ? "Show all tours"
                  : "Find tours near me"
              }
              className={[
                "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-60",
                isNearMeActive
                  ? "bg-teal-700 text-white ring-2 ring-teal-300 dark:bg-teal-600 dark:ring-teal-500/60"
                  : "border border-teal-500 bg-teal-600 text-white hover:bg-teal-600 hover:shadow-md hover:shadow-teal-900/30",
              ].join(" ")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                />
              </svg>

              <span className="hidden xl:inline">
                {isLocating
                  ? "Locating..."
                  : isNearMeActive
                    ? "Near you"
                    : "Near me"}
              </span>
            </button>

            {/* Difficulty */}
            <select
              value={difficulty}
              onChange={(event) => {
                setDifficulty(event.target.value);
              }}
              aria-label="Filter by difficulty"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="difficult">Difficult</option>
            </select>

            {/* Rating */}
            <select
              value={minRating}
              onChange={(event) => {
                setMinRating(Number(event.target.value));
              }}
              aria-label="Filter by minimum rating"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value={0}>Any rating</option>
              <option value={4}>4★ & up</option>
              <option value={4.5}>4.5★ & up</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
              }}
              aria-label="Sort tours"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="price-asc">
                Price: Low → High
              </option>

              <option value="price-desc">
                Price: High → Low
              </option>

              <option value="rating">Top Rated</option>

              <option value="duration">
                Shortest First
              </option>
            </select>

            {/* Result count + clear */}
            <div className="ml-auto flex items-center gap-3">
              <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                {resultsCount} tour
                {resultsCount !== 1 ? "s" : ""}
              </span>

              {(isFiltered || isNearMeActive) && (
                <button
                  id="clear-filters-btn"
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-rose-500 transition-all duration-150 hover:bg-rose-100 hover:text-rose-400 active:scale-95 dark:hover:bg-rose-950/30"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>

                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Location status */}
          {locationError && (
            <p
              role="alert"
              className="mt-3 text-sm font-medium text-rose-600 dark:text-rose-400"
            >
              {locationError}
            </p>
          )}

          {isNearMeActive && !locationError && (
            <div className="mt-3 flex flex-col items-start gap-1 border-t border-slate-200 pt-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300 sm:flex-row sm:items-center sm:gap-3">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true">📍</span>
                Showing tours near your location
              </span>

              <button
                type="button"
                onClick={onClearNearMe}
                className="-my-1 py-1 font-semibold text-teal-600 underline underline-offset-4 transition-colors hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
              >
                Show all tours
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}