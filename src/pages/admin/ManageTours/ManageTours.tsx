import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  Layers,
  Map,
  Plus,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useSearchParams } from "react-router-dom";

import type { RootState } from "../../../store/store";
import type Tour from "../../../types/Tour";
import { deleteTour } from "../../../services/tourApi";
import { getRequestErrorMessage } from "../../../utils/requestError";

import TourSetupProgress from "./components/TourSetupProgress";
import TourFormStepper, {
  TOUR_FORM_STEPS,
} from "./components/TourFormStepper";
import BasicInformationSection from "./components/BasicInformationSection";
import StartLocationSection from "./components/StartLocationSection";
import TourContentSection from "./components/TourContentSection";
import MediaImagesSection from "./components/MediaImagesSection";
import TourGuidesSection from "./components/TourGuidesSection";
import ScheduleSection from "./components/ScheduleSection";
import TourPreviewCard from "./components/TourPreviewCard";
import ExistingToursSection from "./components/ExistingToursSection";
import ResetFormModal from "./components/ResetFormModal";
import CancelConfirmModal from "./components/CancelConfirmModal";
import DeleteTourModal from "./components/DeleteTourModal";

import { useTourImages } from "./hooks/useTourImages";
import { useManageToursData } from "./hooks/useManageToursData";
import { useTourForm } from "./hooks/useTourForm";

function ManageTours() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode: "catalog" (Existing Tours) or "create" (Create Tour Wizard)
  const activeView =
    searchParams.get("view") === "create" ? "create" : "catalog";

  const [currentStep, setCurrentStep] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [createdTourSlug, setCreatedTourSlug] = useState("");
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);

  const canManage =
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
    enabled: canManage,
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
    onError: (message) => {
      setErrorMessage(message);
      // Auto-jump to the first step containing an error
      jumpToFirstErrorStep();
    },
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

  // Catalog metrics
  const catalogStats = useMemo(() => {
    const easy = tours.filter((t) => t.difficulty === "easy").length;
    const medium = tours.filter((t) => t.difficulty === "medium").length;
    const difficult = tours.filter((t) => t.difficulty === "difficult").length;
    return { total: tours.length, easy, medium, difficult };
  }, [tours]);

  // Jump to first step that has field errors
  const jumpToFirstErrorStep = useCallback(() => {
    const errors = tourForm.fieldErrors;
    for (let i = 0; i < TOUR_FORM_STEPS.length; i++) {
      const step = TOUR_FORM_STEPS[i];
      if (step && step.fields.some((f) => Boolean(errors[f]))) {
        setCurrentStep(i);
        return;
      }
    }
  }, [tourForm.fieldErrors]);

  // Step completion indicators
  const isStepCompleted = useCallback(
    (stepIndex: number): boolean => {
      const form = tourForm.form;
      if (stepIndex === 0) {
        return Boolean(
          form.name.trim() &&
            form.duration.trim() &&
            form.maxGroupSize.trim() &&
            form.price.trim() &&
            form.summary.trim() &&
            form.description.trim(),
        );
      }
      if (stepIndex === 1) {
        return Boolean(
          form.startLocationDescription.trim() &&
            form.startLocationLongitude.trim() &&
            form.startLocationLatitude.trim() &&
            form.guides.length > 0 &&
            form.startDates.some(Boolean),
        );
      }
      if (stepIndex === 2) {
        return Boolean(
          (images.coverFile || form.imageCover) &&
            form.images.some(Boolean),
        );
      }
      return false;
    },
    [tourForm.form, images.coverFile],
  );

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

  // Switch to Create View
  function handleOpenCreateTour() {
    setErrorMessage("");
    setSuccessMessage("");
    setSearchParams({ view: "create" });
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Switch to Catalog View (Cancel)
  function handleCancelCreate() {
    if (tourForm.hasFormContent()) {
      setIsCancelConfirmOpen(true);
    } else {
      confirmCancelAndReturn();
    }
  }

  function confirmCancelAndReturn() {
    tourForm.resetForm();
    setCreatedTourSlug("");
    setIsCancelConfirmOpen(false);
    setCurrentStep(0);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function requestResetForm() {
    if (!tourForm.hasFormContent()) {
      tourForm.resetForm();
      setCreatedTourSlug("");
      setCurrentStep(0);
      return;
    }
    setIsResetConfirmOpen(true);
  }

  function openDeleteModal(tour: Tour) {
    setDeleteError("");
    setTourToDelete(tour);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setTourToDelete(null);
    setDeleteError("");
  }

  async function handleDeleteTour() {
    if (!tourToDelete) return;
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
    } catch (error) {
      setDeleteError(getRequestErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  function handleNextStep() {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  }

  function handlePreviousStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canManage) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ─── Top Header ────────────────────────────────────────── */}
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
              {activeView === "create" ? "Create New Tour" : "Tours Catalog"}
            </h1>

            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              {activeView === "create"
                ? "Follow the 3-step setup to publish a new adventure to the catalog."
                : "Browse, view, and manage all adventures in Natours."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              {currentUser.role.replace("-", " ")}
            </div>

            {activeView === "catalog" && (
              <button
                type="button"
                onClick={handleOpenCreateTour}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Create Tour</span>
              </button>
            )}

            {activeView === "create" && (
              <button
                type="button"
                onClick={handleCancelCreate}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Catalog</span>
              </button>
            )}
          </div>
        </div>

        {/* ─── Global Error & Success Alerts ─────────────────────── */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-800 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm dark:border-teal-500/30 dark:bg-teal-500/10"
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

              <div className="flex items-center gap-3">
                {createdTourSlug && (
                  <Link
                    to={`/tours/${createdTourSlug}`}
                    className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
                  >
                    View Tour Page
                  </Link>
                )}

                {activeView === "create" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessMessage("");
                      setSearchParams({});
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-teal-300 bg-white px-4 py-2 text-sm font-bold text-teal-800 transition hover:bg-teal-50 dark:border-teal-600 dark:bg-slate-800 dark:text-teal-300"
                  >
                    Back to Catalog
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 1: CATALOG (EXISTING TOURS) ──────────────────── */}
        {activeView === "catalog" && (
          <div className="mt-8 space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Tours
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {catalogStats.total}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Easy
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {catalogStats.easy}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Medium
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {catalogStats.medium}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Difficult
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {catalogStats.difficult}
                </p>
              </div>
            </div>

            {/* Existing Tours List */}
            <ExistingToursSection
              tours={tours}
              isLoadingTours={isLoadingTours}
              onDeleteClick={openDeleteModal}
              onCreateClick={handleOpenCreateTour}
            />
          </div>
        )}

        {/* ─── VIEW 2: CREATE TOUR (STEPPER / WIZARD) ─────────────── */}
        {activeView === "create" && (
          <div className="mt-6">
            {/* Setup Progress */}
            <TourSetupProgress progress={tourForm.requiredFieldsProgress} />

            {/* Stepper Tabs Navigation */}
            <TourFormStepper
              currentStep={currentStep}
              onStepClick={(stepIndex) => setCurrentStep(stepIndex)}
              fieldErrors={tourForm.fieldErrors}
              isStepCompleted={isStepCompleted}
            />

            {/* ─── Multi-step Form ─────────────────────────────── */}
            <form onSubmit={tourForm.handleSubmit} className="mt-8">
              {/* STEP 1: Basic Info & Content */}
              <div
                className={`space-y-8 ${
                  currentStep === 0 ? "block" : "hidden"
                }`}
              >
                <BasicInformationSection
                  form={tourForm.form}
                  fieldErrors={tourForm.fieldErrors}
                  generatedSlug={tourForm.generatedSlug}
                  onChange={tourForm.updateField}
                  onBlur={(field) =>
                    tourForm.validateField(field, tourForm.form)
                  }
                  renderFieldError={renderFieldError}
                />

                <TourContentSection
                  form={tourForm.form}
                  fieldErrors={tourForm.fieldErrors}
                  onChange={tourForm.updateField}
                  onBlur={(field) =>
                    tourForm.validateField(field, tourForm.form)
                  }
                  renderFieldError={renderFieldError}
                />
              </div>

              {/* STEP 2: Location, Guides & Schedule */}
              <div
                className={`space-y-8 ${
                  currentStep === 1 ? "block" : "hidden"
                }`}
              >
                <StartLocationSection
                  form={tourForm.form}
                  fieldErrors={tourForm.fieldErrors}
                  onChange={tourForm.updateField}
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
                  onBlur={() =>
                    tourForm.validateField("startDates", tourForm.form)
                  }
                  renderFieldError={renderFieldError}
                />
              </div>

              {/* STEP 3: Media & Live Review */}
              <div
                className={`space-y-8 ${
                  currentStep === 2 ? "block" : "hidden"
                }`}
              >
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

                <TourPreviewCard
                  form={tourForm.form}
                  coverPreview={images.coverPreview}
                  galleryImageCount={tourForm.galleryImageCount}
                  startDateCount={tourForm.startDateCount}
                  selectedGuideNames={selectedGuideNames}
                  generatedSlug={tourForm.generatedSlug}
                />
              </div>

              {/* ─── Bottom Actions Bar ─────────────────────────── */}
              <div className="mt-10 flex flex-col-reverse justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center">
                {/* Left actions: Cancel & Reset */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    disabled={tourForm.isSubmitting}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={requestResetForm}
                    disabled={tourForm.isSubmitting}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    Reset Form
                  </button>
                </div>

                {/* Right actions: Previous, Next, Submit */}
                <div className="flex items-center gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      disabled={tourForm.isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>
                  )}

                  {currentStep < 2 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20"
                    >
                      <span>
                        Next: {TOUR_FORM_STEPS[currentStep + 1]?.label}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={tourForm.isSubmitting || isLoadingGuides}
                      className="inline-flex items-center justify-center gap-3 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {tourForm.isSubmitting && (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      )}
                      <span>
                        {tourForm.isSubmitting
                          ? "Creating Tour..."
                          : "Create Tour"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ─── Modals ────────────────────────────────────────────── */}
        <ResetFormModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={() => {
            tourForm.resetForm();
            setCreatedTourSlug("");
            setCurrentStep(0);
            setIsResetConfirmOpen(false);
          }}
        />

        <CancelConfirmModal
          isOpen={isCancelConfirmOpen}
          onClose={() => setIsCancelConfirmOpen(false)}
          onConfirm={confirmCancelAndReturn}
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