import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import GuestRoute from "../components/GuestRoute/GuestRoute";
import Unauthorized from "../components/Unauthorized/Unauthorized";

import Layout from "../layout/Layout";

import { ADMIN_ROLES, MONTHLY_PLAN_ROLES, ROLES } from "../constants/roles";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";
import ForgetPass from "../pages/ForgetPass/ForgetPass";
import ResetPass from "../pages/ResetPass/ResetPass";
import GoogleCallback from "../pages/GoogleCallback/GoogleCallback";
import ViewDetails from "../pages/ViewDetails/ViewDetails";
import MyBooking from "../pages/MyBooking/MyBooking";
import Profile from "../pages/Profile/Profile";
import ConfirmEmailChange from "../pages/ConfirmEmailChange/ConfirmEmailChange";
import AboutUs from "../pages/AboutUs/AboutUs";
import { ContactUs } from "../pages/ContactUs/ContactUs";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import ManageTours from "../pages/admin/ManageTours/ManageTours";
import MonthlyPlan from "../pages/admin/MonthlyPlan/MonthlyPlan";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

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

      {
        path: "unauthorized",
        element: <Unauthorized />,
      },

      {
        path: "forgot-password",
        element: <ForgetPass />,
      },

      {
        path: "reset-password/:token",
        element: <ResetPass />,
      },

      {
        path: "verify-email/:token",
        element: <VerifyEmail />,
      },

      {
        path: "confirm-email-change/:token",
        element: <ConfirmEmailChange />,
      },

      {
        path: "auth/google/callback",
        element: <GoogleCallback />,
      },

      {
        path: "tours/:slug",
        element: <ViewDetails />,
      },

      {
        path: "contact",
        element: <ContactUs />,
      },

      {
        path: "about",
        element: <AboutUs />,
      },

      {
        path: "bookings",
        element: (
          <ProtectedRoute>
            <MyBooking />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-tours",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_ROLES}>
            <ManageTours />
          </ProtectedRoute>
        ),
      },

      {
        path: "monthly-plan",
        element: (
          <ProtectedRoute allowedRoles={MONTHLY_PLAN_ROLES}>
            <MonthlyPlan />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
