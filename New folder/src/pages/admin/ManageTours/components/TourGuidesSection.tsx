import { Users } from "lucide-react";
import type User from "../../../../types/User";

type TourGuidesSectionProps = {
  guides: User[];
  isLoadingGuides: boolean;
  selectedGuideIds: string[];
  selectedGuideNames: string[];
  onToggleGuide: (guideId: string) => void;
  renderFieldError: (field: string) => React.ReactNode;
};

function TourGuidesSection({
  guides,
  isLoadingGuides,
  selectedGuideIds,
  selectedGuideNames,
  onToggleGuide,
  renderFieldError,
}: TourGuidesSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
          <Users className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Tour Guides
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Assign trusted guides to this adventure.
          </p>
        </div>
      </div>

      {isLoadingGuides ? (
        <div className="flex h-32 items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent dark:border-teal-400" />
          Loading guides...
        </div>
      ) : guides.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50 text-sm font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          No guides available.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {guides.map((guide) => {
            const isSelected = selectedGuideIds.includes(guide._id);

            return (
              <label
                key={guide._id}
                className={[
                  "group relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md",
                  isSelected
                    ? "border-teal-500 bg-teal-50/50 dark:border-teal-400 dark:bg-teal-500/10"
                    : "border-transparent bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full font-bold text-white shadow-sm",
                      isSelected
                        ? "bg-teal-500"
                        : "bg-slate-300 dark:bg-slate-700",
                    ].join(" ")}
                  >
                    {guide.name.charAt(0).toUpperCase()}
                  </div>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleGuide(guide._id)}
                    className="h-5 w-5 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>

                <div>
                  <p
                    className={[
                      "font-semibold",
                      isSelected
                        ? "text-teal-900 dark:text-teal-100"
                        : "text-slate-800 dark:text-slate-200",
                    ].join(" ")}
                  >
                    {guide.name}
                  </p>

                  <p
                    className={[
                      "text-xs font-medium capitalize",
                      isSelected
                        ? "text-teal-700 dark:text-teal-400"
                        : "text-slate-500 dark:text-slate-400",
                    ].join(" ")}
                  >
                    {guide.role.replace("-", " ")}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {renderFieldError("guides")}

      {selectedGuideNames.length > 0 && (
        <p className="mt-4 text-xs font-medium text-teal-700 dark:text-teal-400">
          Selected: {selectedGuideNames.join(", ")}
        </p>
      )}
    </section>
  );
}

export default TourGuidesSection;
