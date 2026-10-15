import { lazy, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import GuestRoute from "../components/GuestRoute/GuestRoute";
import Unauthorized from "../components/Unauthorized/Unauthorized";

import Layout from "../layout/Layout";

import { ADMIN_ROLES, MONTHLY_PLAN_ROLES, ROLES, type Role } from "../constants/roles";

// Public pages
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Signup = lazy(() => import("../pages/Signup/Signup"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail/VerifyEmail"));
const ForgetPass = lazy(() => import("../pages/ForgetPass/ForgetPass"));
const ResetPass = lazy(() => import("../pages/ResetPass/ResetPass"));
const GoogleCallback = lazy(() => import("../pages/GoogleCallback/GoogleCallback"));
const ViewDetails = lazy(() => import("../pages/ViewDetails/ViewDetails"));
const ConfirmEmailChange = lazy(() =>
  import("../pages/ConfirmEmailChange/ConfirmEmailChange")
);
const AboutUs = lazy(() => import("../pages/AboutUs/AboutUs"));

// ContactUs is a named export
const ContactUs = lazy(() =>
  import("../pages/ContactUs/ContactUs").then((m) => ({ default: m.ContactUs }))
);

// Authenticated pages
const MyBooking = lazy(() => import("../pages/MyBooking/MyBooking"));
const Profile = lazy(() => import("../pages/Profile/Profile"));

// Admin pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const ManageTours = lazy(() => import("../pages/admin/ManageTours/ManageTours"));
const MonthlyPlan = lazy(() => import("../pages/admin/MonthlyPlan/MonthlyPlan"));
const AdminBookings = lazy(() => import("../pages/admin/AdminBookings"));

const protectedRoute = (
  element: ReactNode,
  allowedRoles?: readonly Role[]
) => (
  <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "login",
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <GuestRoute>
            <Signup />
          </GuestRoute>
        ),
      },

      { path: "unauthorized", element: <Unauthorized /> },
      { path: "forgot-password", element: <ForgetPass /> },
      { path: "reset-password/:token", element: <ResetPass /> },
      { path: "verify-email/:token", element: <VerifyEmail /> },
      { path: "confirm-email-change/:token", element: <ConfirmEmailChange /> },
      { path: "auth/google/callback", element: <GoogleCallback /> },
      { path: "tours/:slug", element: <ViewDetails /> },
      { path: "contact", element: <ContactUs /> },
      { path: "about", element: <AboutUs /> },

      // Authenticated
      { path: "my-bookings", element: protectedRoute(<MyBooking />) },
      { path: "profile", element: protectedRoute(<Profile />) },

      // Admin / staff
      { path: "admin", element: protectedRoute(<AdminDashboard />, ADMIN_ROLES) },
      {
        path: "admin/users",
        element: protectedRoute(<AdminUsers />, [ROLES.ADMIN]),
      },
      { path: "manage-tours", element: protectedRoute(<ManageTours />, ADMIN_ROLES) },
      {
        path: "monthly-plan",
        element: protectedRoute(<MonthlyPlan />, MONTHLY_PLAN_ROLES),
      },
      { path: "bookings", element: protectedRoute(<AdminBookings />, ADMIN_ROLES) },
      {
        path: "admin/bookings",
        element: protectedRoute(<AdminBookings />, ADMIN_ROLES),
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;