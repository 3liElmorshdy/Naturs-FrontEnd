import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

import type User from "../../../../types/User";
import type { useTourForm } from "../hooks/useTourForm";
import type { useTourImages } from "../hooks/useTourImages";
import TourSetupProgress from "./TourSetupProgress";
import TourFormStepper, { TOUR_FORM_STEPS } from "./TourFormStepper";
import BasicInformationSection from "./BasicInformationSection";
import TourContentSection from "./TourContentSection";
import StartLocationSection from "./StartLocationSection";
import TourGuidesSection from "./TourGuidesSection";
import ScheduleSection from "./ScheduleSection";
import MediaImagesSection from "./MediaImagesSection";
import TourPreviewCard from "./TourPreviewCard";

type TourFormWizardProps = {
  tourForm: ReturnType<typeof useTourForm>;
  images: ReturnType<typeof useTourImages>;
  guides: User[];
  isLoadingGuides: boolean;
  selectedGuideNames: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isStepCompleted: (stepIndex: number) => boolean;
  renderFieldError: (field: string) => React.ReactNode;
  onCancel: () => void;
  onRequestReset: () => void;
};

export function TourFormWizard({
  tourForm,
  images,
  guides,
  isLoadingGuides,
  selectedGuideNames,
  currentStep,
  onStepChange,
  isStepCompleted,
  renderFieldError,
  onCancel,
  onRequestReset,
}: TourFormWizardProps) {
  function handleNextStep() {
    if (currentStep < 2) {
      onStepChange(currentStep + 1);
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  }

  function handlePreviousStep() {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  }

  return (
    <div className="mt-6">
      {/* Setup Progress */}
      <TourSetupProgress progress={tourForm.requiredFieldsProgress} />

      {/* Stepper Tabs Navigation */}
      <TourFormStepper
        currentStep={currentStep}
        onStepClick={onStepChange}
        fieldErrors={tourForm.fieldErrors}
        isStepCompleted={isStepCompleted}
      />

      {/* ─── Multi-step Form ─────────────────────────────────────── */}
      <form onSubmit={tourForm.handleSubmit} className="mt-8">
        {/* STEP 1: Basic Info & Content */}
        <div className={`space-y-8 ${currentStep === 0 ? "block" : "hidden"}`}>
          <BasicInformationSection
            form={tourForm.form}
            fieldErrors={tourForm.fieldErrors}
            generatedSlug={tourForm.generatedSlug}
            onChange={tourForm.updateField}
            onBlur={(field) => tourForm.validateField(field, tourForm.form)}
            renderFieldError={renderFieldError}
          />

          <TourContentSection
            form={tourForm.form}
            fieldErrors={tourForm.fieldErrors}
            onChange={tourForm.updateField}
            onBlur={(field) => tourForm.validateField(field, tourForm.form)}
            renderFieldError={renderFieldError}
          />
        </div>

        {/* STEP 2: Location, Guides & Schedule */}
        <div className={`space-y-8 ${currentStep === 1 ? "block" : "hidden"}`}>
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
            onBlur={() => tourForm.validateField("startDates", tourForm.form)}
            renderFieldError={renderFieldError}
          />
        </div>

        {/* STEP 3: Media & Live Review */}
        <div className={`space-y-8 ${currentStep === 2 ? "block" : "hidden"}`}>
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

        {/* ─── Bottom Actions Bar ─────────────────────────────────── */}
        <div className="mt-10 flex flex-col-reverse justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center">
          {/* Left actions: Cancel & Reset */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={tourForm.isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onRequestReset}
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
                <span>Next: {TOUR_FORM_STEPS[currentStep + 1]?.label}</span>
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
                    ? tourForm.isEditing
                      ? "Saving Changes..."
                      : "Creating Tour..."
                    : tourForm.isEditing
                      ? "Save Changes"
                      : "Create Tour"}
                </span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default TourFormWizard;
