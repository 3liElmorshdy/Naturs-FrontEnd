import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCw, X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  createBooking,
  getBookingErrorMessage,
} from "../../../../services/bookingApi";
import {
  createBookingSchema,
  type CreateBookingFormValues,
} from "../types";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBookingModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBookingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      tourId: "",
      userId: "",
      price: 0,
      paid: true,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateBookingFormValues) => {
    try {
      await createBooking({
        tour: data.tourId,
        user: data.userId,
        price: data.price,
        paid: data.paid,
      });

      toast.success("New booking created successfully!");
      reset();
      onClose();
      onSuccess();
    } catch (error) {
      toast.error(getBookingErrorMessage(error));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Booking
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Tour ID *
            </label>
            <input
              type="text"
              placeholder="e.g. 5c88fa8cf4afda39709c2955"
              {...register("tourId")}
              className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none dark:bg-slate-800 dark:text-white ${
                errors.tourId
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-teal-500 dark:border-slate-700"
              }`}
            />
            {errors.tourId && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.tourId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              User ID *
            </label>
            <input
              type="text"
              placeholder="e.g. 5c8a1d5b0190b214360dc057"
              {...register("userId")}
              className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none dark:bg-slate-800 dark:text-white ${
                errors.userId
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-teal-500 dark:border-slate-700"
              }`}
            />
            {errors.userId && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.userId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Price ($ USD) *
            </label>
            <input
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 497"
              {...register("price", { valueAsNumber: true })}
              className={`mt-1.5 w-full rounded-xl border bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none dark:bg-slate-800 dark:text-white ${
                errors.price
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-teal-500 dark:border-slate-700"
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="create-booking-paid"
              {...register("paid")}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800"
            />
            <label
              htmlFor="create-booking-paid"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Mark as Paid immediately
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>Save Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
