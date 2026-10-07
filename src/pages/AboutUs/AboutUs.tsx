import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  "Hand-picked tours across memorable destinations",
  "Clear details before you book",
  "Experienced guides and small-group experiences",
];

function AboutUs() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400">
            <MapPin className="h-4 w-4" />
            ABOUT NATOURS
          </p>

          <div className="mt-5 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Travel is better when it feels personal.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
              Natours is a simple way to find tours worth taking. We bring
              together great places, trusted guides, and practical information
              so you can spend less time planning and more time enjoying the
              journey.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Browse tours
              <ArrowRight className="h-4 w-4" />
            </Link>

 <Link
  to="/contact"
  className="inline-flex items-center rounded-lg border-2 border-slate-300 bg-white/40 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-400 dark:bg-slate-800/50 dark:text-slate-100 dark:hover:border-teal-300 dark:hover:bg-teal-400/10 dark:hover:text-teal-200 dark:focus:ring-offset-slate-900"
>
  Get in touch
</Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            What we do
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            We make choosing your next trip easier.
          </h2>

          <div className="mt-6 space-y-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            <p>
              There are countless places to visit, but finding a trip that
              actually suits you can be difficult. Natours helps you explore
              well-organized tours without the noise, confusing details, or
              endless searching.
            </p>

            <p>
              Every tour gives you the information you need before booking:
              where you are going, what is included, how long the trip lasts,
              and what other travelers think about it.
            </p>

            <p>
              Whether you are looking for a quiet weekend outdoors or a bigger
              adventure with a group, our goal is simple: help you find a trip
              you will genuinely enjoy.
            </p>
          </div>
        </div>

<aside className="self-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20 sm:p-8">          <p className="text-lg font-bold text-slate-900 dark:text-white">
            What you can expect
          </p>

          <ul className="mt-6 space-y-4">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-700">
            <Link
              to="/tours"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Find a tour
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </aside>
      </section>

      {/* Closing Section */}
      <section className="border-t border-slate-200 bg-teal-700 dark:border-slate-800 dark:bg-teal-800">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Your next adventure can start today.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-teal-100">
              Explore the available tours and choose the experience that feels
              right for you.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-700"
          >
            Explore all tours
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;