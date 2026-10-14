import { AlertCircle, CheckCircle2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useSearchParams } from "react-router-dom";

import type { RootState } from "../../../store/store";
import type Tour from "../../../types/Tour";
import { deleteTour } from "../../../services/tourApi";
import { getRequestErrorMessage } from "../../../utils/requestError";

import TourManagementHeader from "./components/TourManagementHeader";
import TourCatalogStats from "./components/TourCatalogStats";
import ExistingToursSection from "./components/ExistingToursSection";
import TourFormWizard from "./components/TourFormWizard";
import { TOUR_FORM_STEPS } from "./components/TourFormStepper";
import ResetFormModal from "./components/ResetFormModal";
import CancelConfirmModal from "./components/CancelConfirmModal";
import DeleteTourModal from "./components/DeleteTourModal";

import { useTourImages } from "./hooks/useTourImages";
import { useManageToursData } from "./hooks/useManageToursData";
import { useTourForm } from "./hooks/useTourForm";

function ManageTours() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode: "catalog" (Existing Tours) or "create" (Create/Edit Tour Wizard)
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
    onSuccess: (newOrUpdatedTour, message, slug) => {
      setTours((currentTours) => {
        const exists = currentTours.some(
          (t) => t._id === newOrUpdatedTour._id,
        );
        if (exists) {
          return currentTours.map((t) =>
            t._id === newOrUpdatedTour._id ? newOrUpdatedTour : t,
          );
        }
        return [newOrUpdatedTour, ...currentTours];
      });
      setSuccessMessage(message);
      setCreatedTourSlug(slug);
    },
    onError: (message) => {
      setErrorMessage(message);
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
          (images.coverFile || form.imageCover) && form.images.some(Boolean),
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
    tourForm.resetForm();
    setSearchParams({ view: "create" });
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Switch to Edit View
  function handleEditTour(tour: Tour) {
    setErrorMessage("");
    setSuccessMessage("");
    tourForm.loadTour(tour);
    setCurrentStep(0);
    setSearchParams({ view: "create", edit: tour._id });
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

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!canManage) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ─── Reusable Management Header ───────────────────────── */}
        <TourManagementHeader
          activeView={activeView}
          isEditing={tourForm.isEditing}
          editingTourName={tourForm.form.name}
          userRole={currentUser.role}
          onOpenCreate={handleOpenCreateTour}
          onCancelCreate={handleCancelCreate}
        />

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
            <TourCatalogStats
              total={catalogStats.total}
              easy={catalogStats.easy}
              medium={catalogStats.medium}
              difficult={catalogStats.difficult}
            />

            <ExistingToursSection
              tours={tours}
              isLoadingTours={isLoadingTours}
              onDeleteClick={openDeleteModal}
              onEditClick={handleEditTour}
              onCreateClick={handleOpenCreateTour}
            />
          </div>
        )}

        {/* ─── VIEW 2: CREATE / EDIT TOUR (WIZARD) ────────────────── */}
        {activeView === "create" && (
          <TourFormWizard
            tourForm={tourForm}
            images={images}
            guides={guides}
            isLoadingGuides={isLoadingGuides}
            selectedGuideNames={selectedGuideNames}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            isStepCompleted={isStepCompleted}
            renderFieldError={renderFieldError}
            onCancel={handleCancelCreate}
            onRequestReset={requestResetForm}
          />
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