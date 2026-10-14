import { useMemo, useState, type FormEvent } from "react";
import { createInitialForm } from "../constants";
import type { TourFormState } from "../types";
import { slugify } from "../utils";
import { createTour, updateTour } from "../../../../services/tourApi";
import {
  tourFormSchema,
  type TourFormValues,
} from "../../../../schemas/tourSchema";
import type Tour from "../../../../types/Tour";
import type { CreateTourPayload } from "../../../../types/Tour";
import { getRequestErrorMessage } from "../../../../utils/requestError";

type UseTourFormParams = {
  coverFile: File | null;
  galleryFiles: File[];
  resetImages: () => void;
  onSuccess: (tour: Tour, message: string, slug: string) => void;
  onError: (message: string) => void;
  onClearMessages: () => void;
};

export function useTourForm({
  coverFile,
  galleryFiles,
  resetImages,
  onSuccess,
  onError,
  onClearMessages,
}: UseTourFormParams) {
  const [form, setForm] = useState<TourFormState>(createInitialForm());
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatedSlug = useMemo(() => {
    return form.slug.trim() || slugify(form.name);
  }, [form.name, form.slug]);

  const galleryImageCount = useMemo(() => {
    return form.images.filter((image) => image.trim()).length;
  }, [form.images]);

  const startDateCount = useMemo(() => {
    return form.startDates.filter((date) => date.trim()).length;
  }, [form.startDates]);

  const requiredFieldsProgress = useMemo(() => {
    const requiredFields = [
      form.name.trim(),
      form.duration.trim(),
      form.maxGroupSize.trim(),
      form.price.trim(),
      form.summary.trim(),
      form.description.trim(),
      form.imageCover.trim(),
    ];

    const filledFields = requiredFields.filter(Boolean).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }, [
    form.name,
    form.duration,
    form.maxGroupSize,
    form.price,
    form.summary,
    form.description,
    form.imageCover,
  ]);

  function getZodErrors(formToValidate: TourFormState) {
    const result = tourFormSchema.safeParse(formToValidate);
    if (result.success) {
      return {};
    }
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path.join(".");
      if (!errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });
    return errors;
  }

  function validateField(
    field: keyof TourFormState,
    formToValidate: TourFormState,
  ) {
    const allErrors = getZodErrors(formToValidate);
    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      if (allErrors[field]) {
        nextErrors[field] = allErrors[field];
      }
      return nextErrors;
    });
  }

  function clearFieldError(field: string) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }



  function updateField(field: keyof TourFormState, value: string) {
    setForm((currentForm) => {
      const nextForm = {
        ...currentForm,
        [field]: value,
      };
      if (hasSubmitted) {
        validateField(field, nextForm);
      }
      return nextForm;
    });
    onClearMessages();
  }

  function reportImageError(field: "imageCover" | "images", message: string) {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: message,
    }));
  }

  function handleCoverChange(fileName: string) {
    setForm((currentForm) => ({
      ...currentForm,
      imageCover: fileName,
    }));
  }

  function handleGalleryChange(fileNames: string[]) {
    setForm((currentForm) => ({
      ...currentForm,
      images: fileNames.length ? fileNames : [""],
    }));
  }

  function updateStartDate(index: number, value: string) {
    setForm((currentForm) => {
      const startDates = [...currentForm.startDates];
      startDates[index] = value;
      const nextForm = {
        ...currentForm,
        startDates,
      };
      if (hasSubmitted) {
        validateField("startDates", nextForm);
      }
      return nextForm;
    });
    onError("");
  }

  function addStartDate() {
    setForm((currentForm) => ({
      ...currentForm,
      startDates: [...currentForm.startDates, ""],
    }));
    clearFieldError("startDates");
  }

  function removeStartDate(index: number) {
    if (form.startDates.length === 1) {
      return;
    }
    setForm((currentForm) => ({
      ...currentForm,
      startDates: currentForm.startDates.filter(
        (_, dateIndex) => dateIndex !== index,
      ),
    }));
  }

  function toggleGuide(guideId: string) {
    setForm((currentForm) => {
      const alreadySelected = currentForm.guides.includes(guideId);
      const selectedGuides = alreadySelected
        ? currentForm.guides.filter((id) => id !== guideId)
        : [...currentForm.guides, guideId];
      const nextForm = {
        ...currentForm,
        guides: selectedGuides,
      };
      if (hasSubmitted) {
        validateField("guides", nextForm);
      }
      return nextForm;
    });
    clearFieldError("guides");
    onError("");
  }

  function hasFormContent() {
    return Boolean(
      form.name ||
        form.slug ||
        form.duration ||
        form.maxGroupSize ||
        form.price ||
        form.summary ||
        form.description ||
        form.imageCover ||
        form.images.some(Boolean) ||
        form.startDates.some(Boolean) ||
        form.guides.length > 0 ||
        form.startLocationDescription ||
        form.startLocationLongitude ||
        form.startLocationLatitude
    );
  }

  function loadTour(tour: Tour) {
    setEditingTourId(tour._id);
    setForm({
      name: tour.name || "",
      slug: tour.slug || "",
      duration: tour.duration != null ? String(tour.duration) : "",
      maxGroupSize: tour.maxGroupSize != null ? String(tour.maxGroupSize) : "",
      difficulty: tour.difficulty || "easy",
      price: tour.price != null ? String(tour.price) : "",
      summary: tour.summary || "",
      description: tour.description || "",
      imageCover: tour.imageCover || "",
      images: tour.images && tour.images.length > 0 ? tour.images : [""],
      startDates:
        tour.startDates && tour.startDates.length > 0
          ? tour.startDates.map((d) => {
              if (!d) return "";
              const dateStr =
                typeof d === "string" ? d : new Date(d).toISOString();
              return dateStr.split("T")[0] || "";
            })
          : [""],
      guides: tour.guides
        ? tour.guides.map((g) => (typeof g === "string" ? g : g._id))
        : [],
      startLocationDescription: tour.startLocation?.description || "",
      startLocationLongitude:
        tour.startLocation?.coordinates?.[0] != null
          ? String(tour.startLocation.coordinates[0])
          : "",
      startLocationLatitude:
        tour.startLocation?.coordinates?.[1] != null
          ? String(tour.startLocation.coordinates[1])
          : "",
    });
    setFieldErrors({});
    setHasSubmitted(false);
  }

  function resetForm() {
    setForm(createInitialForm());
    setEditingTourId(null);
    resetImages();
    setFieldErrors({});
    setHasSubmitted(false);
    onClearMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setHasSubmitted(true);
    setIsSubmitting(true);
    onClearMessages();
    setFieldErrors({});

    const result = tourFormSchema.safeParse(form);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path.join(".");
        if (!errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      });

      setFieldErrors(errors);
      onError(
        "Please review the highlighted fields before saving the tour.",
      );
      setIsSubmitting(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const values: TourFormValues = result.data;

    // Cover image is required on create, or on edit if no existing cover
    if (!coverFile && !form.imageCover) {
      reportImageError("imageCover", "Cover image is required.");
      onError(
        "Please review the highlighted fields before saving the tour.",
      );
      setIsSubmitting(false);
      return;
    }

    const payload: Omit<CreateTourPayload, "imageCover" | "images"> = {
      name: values.name,
      slug: values.slug || slugify(values.name),
      duration: Number(values.duration),
      maxGroupSize: Number(values.maxGroupSize),
      difficulty: values.difficulty,
      price: Number(values.price),
      summary: values.summary,
      description: values.description,
      startDates: values.startDates
        .filter(Boolean)
        .map((date) => new Date(date).toISOString()),
      guides: values.guides,
      startLocation: {
        type: "Point",
        description: values.startLocationDescription,
        coordinates: [
          Number(values.startLocationLongitude),
          Number(values.startLocationLatitude),
        ],
      },
    };

    try {
      if (editingTourId) {
        const updatedTour = await updateTour(editingTourId, payload, {
          imageCover: coverFile,
          images: galleryFiles,
        });

        onSuccess(
          updatedTour,
          `"${payload.name}" was updated successfully.`,
          payload.slug || "",
        );
      } else {
        if (!coverFile) {
          reportImageError("imageCover", "Cover image is required.");
          setIsSubmitting(false);
          return;
        }

        const createdTour = await createTour(payload, {
          imageCover: coverFile,
          images: galleryFiles,
        });

        onSuccess(
          createdTour,
          `"${payload.name}" was created successfully and added to the tours catalog.`,
          payload.slug || "",
        );
      }

      setForm(createInitialForm());
      setEditingTourId(null);
      resetImages();
      setFieldErrors({});
      setHasSubmitted(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      onError(getRequestErrorMessage(error));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    fieldErrors,
    hasSubmitted,
    isSubmitting,
    isEditing: Boolean(editingTourId),
    editingTourId,
    generatedSlug,
    galleryImageCount,
    startDateCount,
    requiredFieldsProgress,
    loadTour,
    updateField,
    validateField,
    clearFieldError,
    reportImageError,
    handleCoverChange,
    handleGalleryChange,
    updateStartDate,
    addStartDate,
    removeStartDate,
    toggleGuide,
    hasFormContent,
    resetForm,
    handleSubmit,
  };
}
