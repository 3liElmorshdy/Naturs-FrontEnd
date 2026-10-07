import {
  AlertCircle,
  CalendarDays,
  ImagePlus,
  Map,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import type { RootState } from "../../store/store";
import type User from "../../types/User";


import { createTour, getTourGuides } from "../../services/adminUsers";

import { getRequestErrorMessage } from "../../utils/requestError";
import { CreateTourPayload } from "../../types/Tour";

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
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function inputClassName() {
  return "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";
}

function ManageTours() {
  const currentUser = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [form, setForm] =
    useState<TourFormState>(initialForm);

  const [guides, setGuides] = useState<User[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const canManageTours =
    currentUser?.role === "admin" ||
    currentUser?.role === "lead-guide";

  useEffect(() => {
    if (!canManageTours) {
      return;
    }

    async function loadGuides() {
      setIsLoadingGuides(true);
      setErrorMessage("");

      try {
        const loadedGuides = await getTourGuides();

        setGuides(loadedGuides);
      } catch (error) {
        setErrorMessage(
          getRequestErrorMessage(error),
        );
      } finally {
        setIsLoadingGuides(false);
      }
    }

    void loadGuides();
  }, [canManageTours]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canManageTours) {
    return <Navigate to="/unauthorized" replace />;
  }

  function updateField(
    field: keyof TourFormState,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setSuccessMessage("");
  }

  function updateImage(index: number, value: string) {
    setForm((currentForm) => {
      const images = [...currentForm.images];
      images[index] = value;

      return {
        ...currentForm,
        images,
      };
    });
  }

  function addImage() {
    setForm((currentForm) => ({
      ...currentForm,
      images: [...currentForm.images, ""],
    }));
  }

  function removeImage(index: number) {
    setForm((currentForm) => {
      const images = currentForm.images.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return {
        ...currentForm,
        images: images.length > 0 ? images : [""],
      };
    });
  }

  function updateStartDate(index: number, value: string) {
    setForm((currentForm) => {
      const startDates = [...currentForm.startDates];
      startDates[index] = value;

      return {
        ...currentForm,
        startDates,
      };
    });
  }

  function addStartDate() {
    setForm((currentForm) => ({
      ...currentForm,
      startDates: [...currentForm.startDates, ""],
    }));
  }

  function removeStartDate(index: number) {
    setForm((currentForm) => {
      const startDates = currentForm.startDates.filter(
        (_, dateIndex) => dateIndex !== index,
      );

      return {
        ...currentForm,
        startDates:
          startDates.length > 0 ? startDates : [""],
      };
    });
  }

  function toggleGuide(guideId: string) {
    setForm((currentForm) => {
      const alreadySelected =
        currentForm.guides.includes(guideId);

      return {
        ...currentForm,
        guides: alreadySelected
          ? currentForm.guides.filter(
              (id) => id !== guideId,
            )
          : [...currentForm.guides, guideId],
      };
    });
  }

  function resetForm() {
    setForm(initialForm);
    setSuccessMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const cleanedImages = form.images
      .map((image) => image.trim())
      .filter(Boolean);

    const cleanedStartDates = form.startDates
      .filter(Boolean)
      .map((date) => new Date(date).toISOString());

    if (cleanedStartDates.length === 0) {
      setErrorMessage(
        "Please add at least one start date.",
      );
      setIsSubmitting(false);
      return;
    }

    if (form.guides.length === 0) {
      setErrorMessage(
        "Please select at least one guide.",
      );
      setIsSubmitting(false);
      return;
    }

    const payload: CreateTourPayload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      duration: Number(form.duration),
      maxGroupSize: Number(form.maxGroupSize),
      difficulty: form.difficulty,
      price: Number(form.price),
      summary: form.summary.trim(),
      description: form.description.trim(),
      imageCover: form.imageCover.trim(),
      images: cleanedImages,
      startDates: cleanedStartDates,
      guides: form.guides,
    };

    try {
      await createTour(payload);

      setSuccessMessage(
        "Tour created successfully.",
      );

      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        getRequestErrorMessage(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Tour management
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create new tour
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Add a new experience to the Natours catalog.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold capitalize text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
            <Map className="h-4 w-4" />
            {currentUser.role.replace("-", " ")}
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          {/* Basic information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                <Map className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Basic information
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Describe the main details of this tour.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Tour name
                </span>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="The Mansoura Explorer"
                  className={inputClassName()}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Slug
                </span>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.target.value,
                    )
                  }
                  placeholder="the-mansoura-explorer"
                  className={inputClassName()}
                />

                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  Leave empty to generate it from the name.
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Difficulty
                </span>

                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    updateField(
                      "difficulty",
                      event.target.value,
                    )
                  }
                  className={inputClassName()}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">
                    Difficult
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Duration in days
                </span>

                <input
                  type="number"
                  min="1"
                  required
                  value={form.duration}
                  onChange={(event) =>
                    updateField(
                      "duration",
                      event.target.value,
                    )
                  }
                  placeholder="4"
                  className={inputClassName()}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Maximum group size
                </span>

                <input
                  type="number"
                  min="1"
                  required
                  value={form.maxGroupSize}
                  onChange={(event) =>
                    updateField(
                      "maxGroupSize",
                      event.target.value,
                    )
                  }
                  placeholder="12"
                  className={inputClassName()}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Price
                </span>

                <input
                  type="number"
                  min="0"
                  required
                  value={form.price}
                  onChange={(event) =>
                    updateField(
                      "price",
                      event.target.value,
                    )
                  }
                  placeholder="399"
                  className={inputClassName()}
                />
              </label>
            </div>
          </section>

          {/* Text content */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Tour content
            </h2>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Summary
                </span>

                <textarea
                  required
                  rows={3}
                  value={form.summary}
                  onChange={(event) =>
                    updateField(
                      "summary",
                      event.target.value,
                    )
                  }
                  placeholder="Discover Mansoura's Nile-side charm, historic streets, local food, and Delta culture."
                  className={inputClassName()}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Description
                </span>

                <textarea
                  required
                  rows={7}
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Write a detailed description of the experience..."
                  className={inputClassName()}
                />
              </label>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                <ImagePlus className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Tour images
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Use image filenames available in your backend images folder.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Cover image filename
                </span>

                <input
                  type="text"
                  required
                  value={form.imageCover}
                  onChange={(event) =>
                    updateField(
                      "imageCover",
                      event.target.value,
                    )
                  }
                  placeholder="tour-mansoura-cover.jpg"
                  className={inputClassName()}
                />
              </label>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Gallery images
                  </span>

                  <button
                    type="button"
                    onClick={addImage}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    <Plus className="h-4 w-4" />
                    Add image
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {form.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={image}
                        onChange={(event) =>
                          updateImage(
                            index,
                            event.target.value,
                          )
                        }
                        placeholder={`tour-mansoura-${index + 1}.jpg`}
                        className={inputClassName()}
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Guides */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Guides
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select one or more guides for this tour.
                </p>
              </div>
            </div>

            <div className="mt-6">
              {isLoadingGuides ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                  Loading guides...
                </div>
              ) : guides.length === 0 ? (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No guides are available.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {guides.map((guide) => {
                    const isSelected =
                      form.guides.includes(guide._id);

                    return (
                      <label
                        key={guide._id}
                        className={[
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition",
                          isSelected
                            ? "border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-500/10"
                            : "border-slate-200 hover:border-teal-300 dark:border-slate-700 dark:hover:border-teal-500/50",
                        ].join(" ")}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleGuide(guide._id)
                          }
                          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />

                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {guide.name}
                          </p>

                          <p className="mt-0.5 text-xs capitalize text-slate-500 dark:text-slate-400">
                            {guide.role.replace("-", " ")}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Start dates */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Start dates
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add the dates when travelers can start this tour.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {form.startDates.map((date, index) => (
                <div
                  key={index}
                  className="flex gap-2"
                >
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(event) =>
                      updateStartDate(
                        index,
                        event.target.value,
                      )
                    }
                    className={inputClassName()}
                  />

                  <button
                    type="button"
                    onClick={() => removeStartDate(index)}
                    className="mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    aria-label={`Remove start date ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addStartDate}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
              >
                <Plus className="h-4 w-4" />
                Add start date
              </button>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingGuides}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}

              {isSubmitting
                ? "Creating tour..."
                : "Create tour"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ManageTours;