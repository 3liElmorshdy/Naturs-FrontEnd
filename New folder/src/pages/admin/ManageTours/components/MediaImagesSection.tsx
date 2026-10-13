import { ImagePlus, Trash2, X } from "lucide-react";
import { ImageDropZone } from "../ImageDropZone";
import { MAX_GALLERY_IMAGES } from "../constants";

type MediaImagesSectionProps = {
  coverPreview: string;
  galleryPreviews: string[];
  galleryFiles: File[];
  galleryImageCount: number;
  fieldErrors: Record<string, string>;
  onCoverSelected: (files: File[]) => void;
  onRemoveCover: () => void;
  onGallerySelected: (files: File[]) => void;
  onRemoveGalleryFile: (index: number) => void;
  onReportImageError: (field: "imageCover" | "images", message: string) => void;
  renderFieldError: (field: string) => React.ReactNode;
};

function MediaImagesSection({
  coverPreview,
  galleryPreviews,
  galleryFiles,
  galleryImageCount,
  fieldErrors,
  onCoverSelected,
  onRemoveCover,
  onGallerySelected,
  onRemoveGalleryFile,
  onReportImageError,
  renderFieldError,
}: MediaImagesSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
          <ImagePlus className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Media and Images
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload the cover and gallery images for this tour.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Cover Image
          </span>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {coverPreview && (
              <div className="group relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={onRemoveCover}
                  aria-label="Remove cover image"
                  title="Remove cover image"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur transition-colors hover:bg-rose-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className={coverPreview ? "" : "sm:col-span-2"}>
              <ImageDropZone
                id="tour-cover-image"
                hasError={Boolean(fieldErrors.imageCover)}
                onFiles={onCoverSelected}
                onError={(message) =>
                  onReportImageError("imageCover", message)
                }
              />
            </div>
          </div>

          {renderFieldError("imageCover")}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Gallery Images
            </span>

            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {galleryFiles.length}/{MAX_GALLERY_IMAGES}
            </span>
          </div>

          {galleryFiles.length === 0 ? (
            <div className="mt-3">
              <ImageDropZone
                id="tour-gallery-images"
                multiple
                maxFiles={MAX_GALLERY_IMAGES}
                hasError={Boolean(fieldErrors.images)}
                onFiles={onGallerySelected}
                onError={(message) =>
                  onReportImageError("images", message)
                }
              />
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {galleryPreviews.map((preview, index) => (
                <div
                  key={`${galleryFiles[index]?.name ?? "image"}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                >
                  <img
                    src={preview}
                    alt={`Gallery image ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={() => onRemoveGalleryFile(index)}
                    aria-label={`Remove image ${index + 1}`}
                    title={`Remove image ${index + 1}`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur transition-colors hover:bg-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {galleryFiles.length < MAX_GALLERY_IMAGES && (
                <ImageDropZone
                  id="tour-gallery-images"
                  multiple
                  variant="tile"
                  maxFiles={MAX_GALLERY_IMAGES - galleryFiles.length}
                  hasError={Boolean(fieldErrors.images)}
                  onFiles={onGallerySelected}
                  onError={(message) =>
                    onReportImageError("images", message)
                  }
                />
              )}
            </div>
          )}

          {renderFieldError("images")}

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {galleryImageCount} gallery image
            {galleryImageCount === 1 ? "" : "s"} added.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MediaImagesSection;
