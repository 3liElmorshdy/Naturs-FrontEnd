import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { sendContactMessage } from "../../services/contactService";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .min(2, "Your name must be at least 2 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .pipe(z.email("Please enter a valid email address.")),

  subject: z
    .string()
    .trim()
    .min(1, "Please enter a subject.")
    .min(3, "The subject must be at least 3 characters."),

  message: z
    .string()
    .trim()
    .min(1, "Please enter your message.")
    .min(10, "Your message must be at least 10 characters."),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface FormStatus {
  type: "idle" | "success" | "error";
  message?: string;
}

const inputClassName = (hasError: boolean) =>
  `mt-1 block w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:ring-2 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
      : "border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-600"
  }`;

export function ContactUs() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setStatus({ type: "idle" });

    try {
      const response = await sendContactMessage(data);

      setStatus({
        type: "success",
        message:
          response.message ||
          "Thanks for reaching out! We'll get back to you within one business day.",
      });

      reset();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again later.",
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | Natours</title>
        <meta
          name="description"
          content="Get in touch with Natours for bookings, tour questions, or support."
        />
      </Helmet>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Get in touch
          </h1>

          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Need help with a booking, a tour, or your Natours account?
            <br />
            Our support team is here to help.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="contact-info-title">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <h2
                id="contact-info-title"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Planning your next adventure?
              </h2>

              <div className="mt-5 space-y-6 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
                    Need help planning?
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    Tell us where you want to go.
                  </h3>

                  <p className="mt-3 max-w-md leading-6">
                    Have a question about a tour, booking, or your Natours
                    account? Send us a message and our team will get back to
                    you as soon as possible.
                  </p>
                </div>

                <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 dark:border-teal-900/50 dark:bg-teal-950/30">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.925l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.918A2.25 2.25 0 0 1 2.25 6.993V6.75"
                      />
                    </svg>

                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Response time
                      </p>

                      <p className="mt-1 leading-6">
                        We usually reply within one business day.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Messages submitted through this form are delivered to the
                  project owner.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="contact-form-title">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <h2
                id="contact-form-title"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Send a message
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Fill in the form below and we will get back to you soon.
              </p>

              <form
                className="mt-6"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Your name
                    </label>

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? "name-error" : undefined
                      }
                      className={inputClassName(Boolean(errors.name))}
                      {...register("name")}
                    />

                    {errors.name && (
                      <p
                        id="name-error"
                        role="alert"
                        className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className={inputClassName(Boolean(errors.email))}
                      {...register("email")}
                    />

                    {errors.email && (
                      <p
                        id="email-error"
                        role="alert"
                        className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      type="text"
                      autoComplete="off"
                      placeholder="Question about a booking"
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={
                        errors.subject ? "subject-error" : undefined
                      }
                      className={inputClassName(Boolean(errors.subject))}
                      {...register("subject")}
                    />

                    {errors.subject && (
                      <p
                        id="subject-error"
                        role="alert"
                        className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help you?"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      className={`${inputClassName(
                        Boolean(errors.message),
                      )} resize-y`}
                      {...register("message")}
                    />

                    {errors.message && (
                      <p
                        id="message-error"
                        role="alert"
                        className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                        />
                      </svg>

                      Sending...
                    </>
                  ) : (
                    <>
                      Send message

                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </>
                  )}
                </button>

                {status.type === "success" && (
                  <div
                    role="status"
                    className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800"
                  >
                    {status.message}
                  </div>
                )}

                {status.type === "error" && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-800"
                  >
                    {status.message}
                  </div>
                )}
              </form>
            </div>
          </section>
        </div>

        <footer className="mt-16 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} Natours · Built by{" "}
            <a
              href="https://www.linkedin.com/in/ali-elmorshedy-363877348/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Ali Elmorshedy
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}