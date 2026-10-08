import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ImagePlus,
  Map,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import {
  createTour,
  deleteTour,
  getAllTours,
} from "../../../services/tourApi";
import { getTourGuides } from "../../../services/adminUsers";
import {
  tourFormSchema,
  type TourFormValues,
} from "../../../schemas/tourSchema";
import type { RootState } from "../../../store/store";
import type Tour from "../../../types/Tour";
import type { CreateTourPayload, StartLocation } from "../../../types/Tour";
import type User from "../../../types/User";
import { getRequestErrorMessage } from "../../../utils/requestError";

type TourFormState = {
  name: string;
  slug: string;
  duration: string;
  maxGroupSize: string;
  difficulty: "easy" | "medium" | "difficult";
  price: string;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  guides: string[];

  startLocationDescription: string;
  startLocationLongitude: string;
  startLocationLatitude: string;
};

const initialForm: TourFormState = {
  name: "",
  slug: "",
  duration: "",
  maxGroupSize: "",
  difficulty: "easy",
  price: "",
  summary: "",
  description: "",
  imageCover: "",
  images: [""],
  startDates: [""],
  guides: [],

  startLocationDescription: "",
  startLocationLongitude: "",
  startLocationLatitude: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function inputClassName(hasError = false) {
  return [
    "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:ring-4 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600",
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-500/60 dark:focus:border-rose-400"
      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/10 dark:border-slate-700 dark:focus:border-teal-400 dark:focus:ring-teal-400/10",
  ].join(" ");
}

function ManageTours() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [form, setForm] = useState<TourFormState>(initialForm);

  const [guides, setGuides] = useState<User[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);

  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>(
    {},
  );

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const [createdTourSlug, setCreatedTourSlug] = useState("");

  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);

  const canManageTours =
    currentUser?.role === "admin" || currentUser?.role === "lead-guide";

  const generatedSlug = useMemo(() => {
    return form.slug.trim() || slugify(form.name);
  }, [form.name, form.slug]);

  const selectedGuideNames = useMemo(() => {
    return guides
      .filter((guide) => form.guides.includes(guide._id))
      .map((guide) => guide.name);
  }, [form.guides, guides]);

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

  useEffect(() => {
    if (!canManageTours) {
      return;
    }

    async function loadGuides() {
      setIsLoadingGuides(true);

      try {
        const loadedGuides = await getTourGuides();

        setGuides(loadedGuides);
      } catch (error) {
        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        setIsLoadingGuides(false);
      }
    }

    void loadGuides();
  }, [canManageTours]);

  useEffect(() => {
    if (!canManageTours) {
      return;
    }

    async function loadTours() {
      setIsLoadingTours(true);

      try {
        const loadedTours = await getAllTours();

        setTours(loadedTours);
      } catch (error) {
        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        setIsLoadingTours(false);
      }
    }

    void loadTours();
  }, [canManageTours]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canManageTours) {
    return <Navigate to="/unauthorized" replace />;
  }

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

  function renderFieldError(field: string) {
    const error = fieldErrors[field];

    if (!error) {
      return null;
    }

    return (
      <p
        role="alert"
        className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400"
      >
        {error}
      </p>
    );
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

    setErrorMessage("");
    setSuccessMessage("");
  }

  function updateImage(index: number, value: string) {
    setForm((currentForm) => {
      const images = [...currentForm.images];

      images[index] = value;

      const nextForm = {
        ...currentForm,
        images,
      };

      if (hasSubmitted) {
        validateField("images", nextForm);
      }

      return nextForm;
    });

    setErrorMessage("");
  }

  function addImage() {
    setForm((currentForm) => ({
      ...currentForm,
      images: [...currentForm.images, ""],
    }));

    clearFieldError("images");
  }

  function removeImage(index: number) {
    if (form.images.length === 1) {
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      images: currentForm.images.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
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

    setErrorMessage("");
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
    setErrorMessage("");
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

  function resetForm() {
    setForm(initialForm);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});
    setHasSubmitted(false);
    setCreatedTourSlug("");
  }

  function requestResetForm() {
    if (!hasFormContent()) {
      resetForm();
      return;
    }

    setIsResetConfirmOpen(true);
  }

  function openDeleteModal(tour: Tour) {
    setDeleteError("");
    setTourToDelete(tour);
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setTourToDelete(null);
    setDeleteError("");
  }

  async function handleDeleteTour() {
    if (!tourToDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteTour(tourToDelete._id);

      setTours((currentTours) =>
        currentTours.filter((tour) => tour._id !== tourToDelete._id),
      );

      setSuccessMessage(`"${tourToDelete.name}" was deleted successfully.`);
      setCreatedTourSlug("");

      setTourToDelete(null);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setDeleteError(getRequestErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setHasSubmitted(true);
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
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

      setErrorMessage(
        "Please review the highlighted fields before creating the tour.",
      );

      setIsSubmitting(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      

      return;
    }

    const values: TourFormValues = result.data;

const payload: CreateTourPayload = {
  name: values.name,
  slug: values.slug || slugify(values.name),
  duration: Number(values.duration),
  maxGroupSize: Number(values.maxGroupSize),
  difficulty: values.difficulty,
  price: Number(values.price),
  summary: values.summary,
  description: values.description,
  imageCover: values.imageCover,

  images: values.images
    .map((image) => image.trim())
    .filter(Boolean),

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
      const createdTour = await createTour(payload);

      setTours((currentTours) => [createdTour, ...currentTours]);

      setSuccessMessage(
        `"${payload.name}" was created successfully and added to the tours catalog.`,
      );

      setCreatedTourSlug(payload.slug || "");
      setForm(initialForm);
      setFieldErrors({});
      setHasSubmitted(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 shadow-sm dark:bg-teal-500/20 dark:text-teal-400">
                <Map className="h-5 w-5" />
              </div>

              <p className="text-sm font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
                Tour Management
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Create New Tour
            </h1>

            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Add a new adventure to the Natours catalog and manage existing
              tours.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>

            {currentUser.role.replace("-", " ")}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Tour setup progress
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Complete the main fields before publishing.
              </p>
            </div>

            <span className="text-sm font-bold text-teal-700 dark:text-teal-400">
              {requiredFieldsProgress}%
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
              style={{
                width: `${requiredFieldsProgress}%`,
              }}
            />
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-8 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-800 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm dark:border-teal-500/30 dark:bg-teal-500/10"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 text-sm font-medium text-teal-800 dark:text-teal-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div>
                  <p className="font-bold">Operation completed successfully</p>

                  <p className="mt-1">{successMessage}</p>
                </div>
              </div>

              {createdTourSlug && (
                <Link
                  to={`/tours/${createdTourSlug}`}
                  className="inline-flex w-fit items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
                >
                  View Tour
                </Link>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <Map className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Essential details that define the tour.
                </p>
              </div>
            </div>




            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
  <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
      <Map className="h-6 w-6" />
    </div>

    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Start Location
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Enter the starting point of this tour.
      </p>
    </div>
  </div>

  <div className="grid gap-6 md:grid-cols-2">
    <label className="block md:col-span-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Location Description
      </span>

      <input
        type="text"
        value={form.startLocationDescription}
        onChange={(event) =>
          updateField(
            "startLocationDescription",
            event.target.value,
          )
        }
        placeholder="Mansoura, Egypt"
        className={inputClassName(
          Boolean(fieldErrors.startLocationDescription),
        )}
      />

      {renderFieldError("startLocationDescription")}
    </label>

    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Longitude
      </span>

      <input
        type="number"
        step="any"
        value={form.startLocationLongitude}
        onChange={(event) =>
          updateField(
            "startLocationLongitude",
            event.target.value,
          )
        }
        placeholder="31.0409"
        className={inputClassName(
          Boolean(fieldErrors.startLocationLongitude),
        )}
      />

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Example: 31.0409
      </p>

      {renderFieldError("startLocationLongitude")}
    </label>

    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Latitude
      </span>

      <input
        type="number"
        step="any"
        value={form.startLocationLatitude}
        onChange={(event) =>
          updateField(
            "startLocationLatitude",
            event.target.value,
          )
        }
        placeholder="31.3785"
        className={inputClassName(
          Boolean(fieldErrors.startLocationLatitude),
        )}
      />

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Example: 31.3785
      </p>

      {renderFieldError("startLocationLatitude")}
    </label>
  </div>
</section>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Tour Name
                </span>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  onBlur={() => validateField("name", form)}
                  placeholder="The Mansoura Explorer"
                  className={inputClassName(Boolean(fieldErrors.name))}
                />

                {renderFieldError("name")}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Slug
                </span>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  onBlur={() => validateField("slug", form)}
                  placeholder="the-mansoura-explorer"
                  className={inputClassName(Boolean(fieldErrors.slug))}
                />

                {renderFieldError("slug")}

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Tour URL:{" "}
                  <span className="font-mono font-semibold text-teal-700 dark:text-teal-400">
                    /tours/{generatedSlug || "your-tour-slug"}
                  </span>
                </p>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Difficulty
                </span>

                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    updateField("difficulty", event.target.value)
                  }
                  className={inputClassName(Boolean(fieldErrors.difficulty))}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>

                {renderFieldError("difficulty")}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Duration in Days
                </span>

                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(event) =>
                    updateField("duration", event.target.value)
                  }
                  onBlur={() => validateField("duration", form)}
                  placeholder="4"
                  className={inputClassName(Boolean(fieldErrors.duration))}
                />

                {renderFieldError("duration")}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Maximum Group Size
                </span>

                <input
                  type="number"
                  min="1"
                  value={form.maxGroupSize}
                  onChange={(event) =>
                    updateField("maxGroupSize", event.target.value)
                  }
                  onBlur={() => validateField("maxGroupSize", form)}
                  placeholder="12"
                  className={inputClassName(Boolean(fieldErrors.maxGroupSize))}
                />

                {renderFieldError("maxGroupSize")}
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Price in USD
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    updateField("price", event.target.value)
                  }
                  onBlur={() => validateField("price", form)}
                  placeholder="399"
                  className={inputClassName(Boolean(fieldErrors.price))}
                />

                {renderFieldError("price")}
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <Map className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Tour Content
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add a persuasive summary and complete description.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Summary
                </span>

                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(event) =>
                    updateField("summary", event.target.value)
                  }
                  onBlur={() => validateField("summary", form)}
                  placeholder="Discover Mansoura's Nile-side charm, historic streets, local food, and Delta culture."
                  className={`${inputClassName(
                    Boolean(fieldErrors.summary),
                  )} resize-none`}
                />

                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Short, persuasive text for tour cards.
                  </span>

                  <span
                    className={[
                      "shrink-0 text-xs font-bold",
                      form.summary.trim().length < 20
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-teal-600 dark:text-teal-400",
                    ].join(" ")}
                  >
                    {form.summary.trim().length} / 20 minimum
                  </span>
                </div>

                {renderFieldError("summary")}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Description
                </span>

                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  onBlur={() => validateField("description", form)}
                  placeholder="Write a detailed description of the experience, activities, locations, and what makes this tour special..."
                  className={`${inputClassName(
                    Boolean(fieldErrors.description),
                  )} resize-none`}
                />

                <div className="mt-1.5 flex justify-end">
                  <span
                    className={[
                      "text-xs font-bold",
                      form.description.trim().length < 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-teal-600 dark:text-teal-400",
                    ].join(" ")}
                  >
                    {form.description.trim().length} / 50 minimum
                  </span>
                </div>

                {renderFieldError("description")}
              </label>
            </div>
          </section>

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
                  Provide image filenames expected by the backend.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Cover Image
                </span>

                <input
                  type="text"
                  value={form.imageCover}
                  onChange={(event) =>
                    updateField("imageCover", event.target.value)
                  }
                  onBlur={() => validateField("imageCover", form)}
                  placeholder="tour-mansoura-cover.jpg"
                  className={inputClassName(Boolean(fieldErrors.imageCover))}
                />

                {renderFieldError("imageCover")}
              </label>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Gallery Images
                  </span>

                  <button
                    type="button"
                    onClick={addImage}
                    className="group flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100 hover:text-teal-800 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/20"
                  >
                    <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Add Image
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {form.images.map((image, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={image}
                        onChange={(event) =>
                          updateImage(index, event.target.value)
                        }
                        onBlur={() => validateField("images", form)}
                        placeholder={`tour-mansoura-${index + 1}.jpg`}
                        className={inputClassName(
                          Boolean(fieldErrors.images),
                        )}
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={form.images.length === 1}
                        title={
                          form.images.length === 1
                            ? "At least one gallery image is required"
                            : `Remove image ${index + 1}`
                        }
                        className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {renderFieldError("images")}

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {galleryImageCount} gallery image
                  {galleryImageCount === 1 ? "" : "s"} added.
                </p>
              </div>
            </div>
          </section>

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
                  const isSelected = form.guides.includes(guide._id);

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
                          onChange={() => toggleGuide(guide._id)}
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

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <CalendarDays className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Schedule
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Set available dates for future bookings.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {form.startDates.map((date, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(event) =>
                      updateStartDate(index, event.target.value)
                    }
                    onBlur={() => validateField("startDates", form)}
                    className={inputClassName(
                      Boolean(fieldErrors.startDates),
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => removeStartDate(index)}
                    disabled={form.startDates.length === 1}
                    title={
                      form.startDates.length === 1
                        ? "At least one start date is required"
                        : `Remove start date ${index + 1}`
                    }
                    className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    aria-label={`Remove start date ${index + 1}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {renderFieldError("startDates")}

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              {startDateCount} start date
              {startDateCount === 1 ? "" : "s"} added.
            </p>

            <button
              type="button"
              onClick={addStartDate}
              className="mt-5 group flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
              Add Start Date
            </button>
          </section>

          <div className="flex flex-col-reverse justify-end gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={requestResetForm}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingGuides}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isSubmitting ? "Creating Tour..." : "Create Tour"}
            </button>
          </div>
        </form>

        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Existing Tours
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Delete tours from the Natours catalog.
              </p>
            </div>

            <span className="w-fit rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              {tours.length} tours
            </span>
          </div>

          {isLoadingTours ? (
            <div className="mt-6 flex h-40 items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent dark:border-teal-400" />
              Loading tours...
            </div>
          ) : tours.length === 0 ? (
            <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No tours found.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {tours.map((tour) => (
                <article
                  key={tour._id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-500/50"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                      {tour.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {tour.duration} days · ${tour.price}
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                      {tour.difficulty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openDeleteModal(tour)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/10 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    aria-label={`Delete ${tour.name}`}
                    title={`Delete ${tour.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {isResetConfirmOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-tour-form-title"
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="reset-tour-form-title"
                    className="text-lg font-bold text-slate-900 dark:text-white"
                  >
                    Reset this form?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    All information entered for this new tour will be removed.
                    This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  aria-label="Close reset dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Keep Editing
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsResetConfirmOpen(false);
                  }}
                  className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        )}

        {tourToDelete && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-tour-title"
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                    <Trash2 className="h-5 w-5" />
                  </div>

                  <h2
                    id="delete-tour-title"
                    className="mt-4 text-lg font-bold text-slate-900 dark:text-white"
                  >
                    Delete this tour?
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  aria-label="Close delete dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                You are about to permanently delete:
              </p>

              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {tourToDelete.name}
              </p>

              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                This action cannot be undone.
              </div>

              {deleteError && (
                <div
                  role="alert"
                  className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleDeleteTour()}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {isDeleting ? "Deleting..." : "Delete Tour"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ManageTours;