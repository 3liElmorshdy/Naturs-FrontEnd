import type Tour from "../../types/Tour";

interface TourItineraryProps {
  locations: Tour["locations"];
}

export function TourItinerary({
  locations,
}: TourItineraryProps) {
  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="itinerary-heading">
      <h2
        id="itinerary-heading"
        className="mb-3 text-xl font-bold text-slate-800 dark:text-white"
      >
        Itinerary
      </h2>

      <ol className="space-y-3 border-l-2 border-teal-500 pl-5">
        {[...locations]
          .sort((a, b) => a.day - b.day)
          .map((location) => (
            <li key={location._id ?? location.id ?? location.day}>
              <p className="text-xs font-semibold uppercase text-teal-600">
                Day {location.day}
              </p>

              <p className="text-slate-700 dark:text-slate-200">
                {location.description}
              </p>
            </li>
          ))}
      </ol>
    </section>
  );
}