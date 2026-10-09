import { useEffect, useMemo, useState } from "react";

import { MAX_GALLERY_IMAGES } from "../constants";

type UseTourImagesParams = {
  onCoverChange: (fileName: string) => void;
  onGalleryChange: (fileNames: string[]) => void;
  onClearFieldError: (field: "imageCover" | "images") => void;
  onClearErrorMessage: () => void;
};

export function useTourImages({
  onCoverChange,
  onGalleryChange,
  onClearFieldError,
  onClearErrorMessage,
}: UseTourImagesParams) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const coverPreview = useMemo(() => {
    return coverFile ? URL.createObjectURL(coverFile) : "";
  }, [coverFile]);

  const galleryPreviews = useMemo(() => {
    return galleryFiles.map((file) => URL.createObjectURL(file));
  }, [galleryFiles]);

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryPreviews]);

  function handleCoverSelected(files: File[]) {
    const file = files[0];

    if (!file) {
      return;
    }

    setCoverFile(file);
    onCoverChange(file.name);
    onClearFieldError("imageCover");
    onClearErrorMessage();
  }

  function removeCover() {
    setCoverFile(null);
    onCoverChange("");
  }

  function syncGalleryFiles(nextFiles: File[]) {
    setGalleryFiles(nextFiles);

    const fileNames = nextFiles.map((file) => file.name);

    onGalleryChange(fileNames);
  }

  function handleGallerySelected(files: File[]) {
    const nextFiles = [...galleryFiles, ...files].slice(
      0,
      MAX_GALLERY_IMAGES,
    );

    syncGalleryFiles(nextFiles);
    onClearFieldError("images");
    onClearErrorMessage();
  }

  function removeGalleryFile(index: number) {
    const nextFiles = galleryFiles.filter(
      (_, fileIndex) => fileIndex !== index,
    );

    syncGalleryFiles(nextFiles);
  }

  function resetImages() {
    setCoverFile(null);
    setGalleryFiles([]);
  }

  return {
    coverFile,
    galleryFiles,
    coverPreview,
    galleryPreviews,
    handleCoverSelected,
    removeCover,
    handleGallerySelected,
    removeGalleryFile,
    resetImages,
  };
}
