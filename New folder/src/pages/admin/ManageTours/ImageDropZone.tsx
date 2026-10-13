import { ImagePlus, Plus, UploadCloud } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface ImageDropZoneProps {
  id: string;
  multiple?: boolean;
  /** "large" = full call-to-action zone, "tile" = compact "Add More" square */
  variant?: "large" | "tile";
  hasError?: boolean;
  disabled?: boolean;
  /** Max number of files accepted in a single selection */
  maxFiles?: number;
  onFiles: (files: File[]) => void;
  onError: (message: string) => void;
}

export function ImageDropZone({
  id,
  multiple = false,
  variant = "large",
  hasError = false,
  disabled = false,
  maxFiles,
  onFiles,
  onError,
}: ImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0 || disabled) {
      return;
    }

    const incoming = Array.from(fileList);

    const invalidType = incoming.find(
      (file) => !ACCEPTED_TYPES.includes(file.type),
    );

    if (invalidType) {
      onError(`"${invalidType.name}" is not supported. Use PNG, JPG or WEBP.`);
      return;
    }

    const tooLarge = incoming.find((file) => file.size > MAX_IMAGE_SIZE);

    if (tooLarge) {
      onError(`"${tooLarge.name}" is larger than 5MB.`);
      return;
    }

    const files = multiple ? incoming : incoming.slice(0, 1);

    if (maxFiles !== undefined && files.length > maxFiles) {
      onError(`You can add only ${maxFiles} more image${maxFiles === 1 ? "" : "s"}.`);
      files.length = maxFiles;
    }

    if (files.length > 0) {
      onFiles(files);
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  const stateClass = hasError
    ? "border-rose-400 bg-rose-50/50 dark:border-rose-500/60 dark:bg-rose-500/5"
    : isDragging
      ? "scale-[1.01] border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-500/10"
      : "border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/60 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-teal-500/60 dark:hover:bg-teal-500/5";

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple={multiple}
        hidden
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        aria-label={multiple ? "Add gallery images" : "Choose cover image"}
        className={[
          "group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          variant === "tile"
            ? "aspect-square w-full gap-1 p-3"
            : "h-full min-h-48 w-full gap-3 p-6",
          stateClass,
        ].join(" ")}
      >
        {variant === "tile" ? (
          <>
            <Plus className="h-6 w-6 text-slate-400 transition-transform group-hover:scale-110 group-hover:text-teal-600" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Add More
            </span>
          </>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700 transition-transform group-hover:-translate-y-1 dark:bg-teal-500/15 dark:text-teal-300">
              {isDragging ? (
                <ImagePlus className="h-6 w-6" />
              ) : (
                <UploadCloud className="h-6 w-6" />
              )}
            </span>

            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Drag and drop {multiple ? "your images" : "your cover image"}{" "}
              here, or{" "}
              <span className="text-teal-600 underline dark:text-teal-400">
                browse
              </span>
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              PNG, JPG or WEBP up to 5MB
            </span>
          </>
        )}
      </button>
    </>
  );
}
