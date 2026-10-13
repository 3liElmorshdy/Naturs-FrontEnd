import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
      <NavBar />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
