import {
  AlertCircle,
  CheckCircle2,
  Map,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import type { RootState } from "../../../store/store";
import type Tour from "../../../types/Tour";
import { deleteTour } from "../../../services/tourApi";
import { getRequestErrorMessage } from "../../../utils/requestError";

import TourSetupProgress from "./components/TourSetupProgress";
import BasicInformationSection from "./components/BasicInformationSection";
import StartLocationSection from "./components/StartLocationSection";
import TourContentSection from "./components/TourContentSection";
import MediaImagesSection from "./components/MediaImagesSection";
import TourGuidesSection from "./components/TourGuidesSection";
import ScheduleSection from "./components/ScheduleSection";
import ExistingToursSection from "./components/ExistingToursSection";
import ResetFormModal from "./components/ResetFormModal";
import DeleteTourModal from "./components/DeleteTourModal";

import { useTourImages } from "./hooks/useTourImages";
import { useManageToursData } from "./hooks/useManageToursData";
import { useTourForm } from "./hooks/useTourForm";

function ManageTours() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [createdTourSlug, setCreatedTourSlug] = useState("");
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);

  const canManageTours =
    currentUser?.role === "admin" || currentUser?.role === "lead-guide";

  const handleDataError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const {
    guides,
    tours,
    setTours,
    isLoadingGuides,
    isLoadingTours,
  } = useManageToursData({
    enabled: canManageTours,
    onError: handleDataError,
  });

  const images = useTourImages({
    onCoverChange: (fileName) => tourForm.handleCoverChange(fileName),
    onGalleryChange: (fileNames) => tourForm.handleGalleryChange(fileNames),
    onClearFieldError: (field) => tourForm.clearFieldError(field),
    onClearErrorMessage: () => setErrorMessage(""),
  });

  const tourForm = useTourForm({
    coverFile: images.coverFile,
    galleryFiles: images.galleryFiles,
    resetImages: images.resetImages,
    onSuccess: (newTour, message, slug) => {
      setTours((currentTours) => [newTour, ...currentTours]);
      setSuccessMessage(message);
      setCreatedTourSlug(slug);
    },
    onError: (message) => setErrorMessage(message),
    onClearMessages: () => {
      setErrorMessage("");
      setSuccessMessage("");
    },
  });

  const selectedGuideNames = useMemo(() => {
    return guides
      .filter((guide) => tourForm.form.guides.includes(guide._id))
      .map((guide) => guide.name);
  }, [tourForm.form.guides, guides]);

  function renderFieldError(field: string) {
    const error = tourForm.fieldErrors[field];
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

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canManageTours) {
    return <Navigate to="/unauthorized" replace />;
  }

  function requestResetForm() {
    if (!tourForm.hasFormContent()) {
      tourForm.resetForm();
      setCreatedTourSlug("");
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

        <TourSetupProgress progress={tourForm.requiredFieldsProgress} />

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

        <form onSubmit={tourForm.handleSubmit} className="mt-10 space-y-8">
          <BasicInformationSection
            form={tourForm.form}
            fieldErrors={tourForm.fieldErrors}
            generatedSlug={tourForm.generatedSlug}
            onChange={tourForm.updateField}
            onBlur={(field) => tourForm.validateField(field, tourForm.form)}
            renderFieldError={renderFieldError}
          />

          <StartLocationSection
            form={tourForm.form}
            fieldErrors={tourForm.fieldErrors}
            onChange={tourForm.updateField}
            renderFieldError={renderFieldError}
          />

          <TourContentSection
            form={tourForm.form}
            fieldErrors={tourForm.fieldErrors}
            onChange={tourForm.updateField}
            onBlur={(field) => tourForm.validateField(field, tourForm.form)}
            renderFieldError={renderFieldError}
          />

          <MediaImagesSection
            coverPreview={images.coverPreview}
            galleryPreviews={images.galleryPreviews}
            galleryFiles={images.galleryFiles}
            galleryImageCount={tourForm.galleryImageCount}
            fieldErrors={tourForm.fieldErrors}
            onCoverSelected={images.handleCoverSelected}
            onRemoveCover={images.removeCover}
            onGallerySelected={images.handleGallerySelected}
            onRemoveGalleryFile={images.removeGalleryFile}
            onReportImageError={tourForm.reportImageError}
            renderFieldError={renderFieldError}
          />

          <TourGuidesSection
            guides={guides}
            isLoadingGuides={isLoadingGuides}
            selectedGuideIds={tourForm.form.guides}
            selectedGuideNames={selectedGuideNames}
            onToggleGuide={tourForm.toggleGuide}
            renderFieldError={renderFieldError}
          />

          <ScheduleSection
            startDates={tourForm.form.startDates}
            startDateCount={tourForm.startDateCount}
            fieldErrors={tourForm.fieldErrors}
            onUpdateStartDate={tourForm.updateStartDate}
            onAddStartDate={tourForm.addStartDate}
            onRemoveStartDate={tourForm.removeStartDate}
            onBlur={() => tourForm.validateField("startDates", tourForm.form)}
            renderFieldError={renderFieldError}
          />

          <div className="flex flex-col-reverse justify-end gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={requestResetForm}
              disabled={tourForm.isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={tourForm.isSubmitting || isLoadingGuides}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tourForm.isSubmitting && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {tourForm.isSubmitting ? "Creating Tour..." : "Create Tour"}
            </button>
          </div>
        </form>

        <ExistingToursSection
          tours={tours}
          isLoadingTours={isLoadingTours}
          onDeleteClick={openDeleteModal}
        />

        <ResetFormModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={() => {
            tourForm.resetForm();
            setCreatedTourSlug("");
            setIsResetConfirmOpen(false);
          }}
        />

        <DeleteTourModal
          tour={tourToDelete}
          isDeleting={isDeleting}
          errorMessage={deleteError}
          onClose={closeDeleteModal}
          onConfirm={() => void handleDeleteTour()}
        />
      </div>
    </main>
  );
}

export default ManageTours;