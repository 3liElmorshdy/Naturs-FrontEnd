import { TOUR_IMG } from   "../../utils/viewDetails";

interface TourGalleryProps {
  tourName: string;
  tourId: string;
  images?: string[];
}

export function TourGallery({
  tourName,
  tourId,
  images = [],
}: TourGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="gallery-heading">
      <h2
        id="gallery-heading"
        className="mb-3 text-xl font-bold text-slate-800 dark:text-white"
      >
        Gallery
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <img
            key={image}
            src={`${TOUR_IMG}${image}`}
            alt={`${tourName} photo ${index + 1}`}
            loading="lazy"
            decoding="async"
            className="h-48 w-full rounded-xl object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                `https://picsum.photos/seed/${tourId}-${index}/600/400`;
            }}
          />
        ))}
      </div>
    </section>
  );
}