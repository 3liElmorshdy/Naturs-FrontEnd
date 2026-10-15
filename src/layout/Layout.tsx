import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import PageLoader from "../components/PageLoader/PageLoader";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-white">
      <ScrollRestoration />
      <NavBar />
      <main className="flex flex-grow flex-col p-6">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default Layout;
