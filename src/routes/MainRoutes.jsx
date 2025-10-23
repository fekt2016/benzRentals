/* eslint-disable react/react-in-jsx-scope */
// src/routes/MainRoutes.jsx
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PATHS, ADMIN_PATHS } from "./routePaths";

// Import your States components
import { LoadingState } from "../components/ui/LoadingSpinner";

// Lazy imports

const AboutUsPage = lazy(() => import("../pages/AboutUsPage"));
const ProtectedRoute = lazy(() => import("./protectedRoute"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const ModelsPage = lazy(() => import("../pages/ModelsPage"));
const CarModelPage = lazy(() => import("../pages/ModelPage"));
const LocationPage = lazy(() => import("../pages/LocationPage"));
const LocationDetailPage = lazy(() => import("../pages/LocationDetailPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const HelpCenterPage = lazy(() => import("../pages/HelpCenterPage"));
const BookingsPage = lazy(() => import("../pages/BookingsPage"));
const BookingDetailPage = lazy(() => import("../pages/BookingDetailPage"));
const ConfirmationPage = lazy(() => import("../pages/ConfirmationPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const LoginPage = lazy(() => import("../Auth/Login"));
const CarReviewsPage = lazy(() => import("../pages/CarReviewPage"));
const NotificationPage = lazy(() => import("../pages/NotificatioPage"));
const Corporate = lazy(()=>import('../pages/Corporate'))
const DisClaimer = lazy(()=>import('../pages/DisClaimerPage'))
const PrivacyPage = lazy(()=>import('../pages/PrivacyPage'))
const Blog = lazy(()=>import('../pages/Blog'))
const AgreementPage = lazy(()=>import('../pages/AgreementPage'))
const ReportsPage = lazy(()=>import('../pages/ReportsPages'))
const CareersPage = lazy(()=>import('../pages/CareersPage'))
const TermsPage = lazy(()=>import('../pages/TermsPage'))
const PoliciesPage = lazy(()=>import('../pages/PoliciesPage'))
const ResetPassword = lazy(() => import("../pages/resetPasswordPage"));

// Layouts
const MainLayout = lazy(() => import("../Layout/MainLayout"));
const AdminLayout = lazy(() => import("../Layout/AdminLayout"));
const UserAuthPage = lazy(() => import("../Layout/UserAuthPage"));

// Admin pages
const AdminDashboard = lazy(() => import("../pages/adminPages/Dashboard"));
const AdminCars = lazy(() => import("../pages/adminPages/Cars"));
const AddCar = lazy(() => import("../pages/adminPages/AddCars"));
const EditCar = lazy(() => import("../pages/adminPages/EditCar"));
const AdminBookings = lazy(() => import("../pages/adminPages/AdminBookings"));
const AdminUsers = lazy(() => import("../pages/adminPages/AdminUser"));
const AdminReports = lazy(() => import("../pages/adminPages/AdminReports"));

// 🔹 Custom Loader Components using your States components
const Loader = () => (
  <LoadingState message="Loading Mercedes-Benz Experience..." size="lg" />
);

// const UserLoader = () => (
//   <LoadingState message="Loading your luxury dashboard..." size="lg" />
// );

const AdminLoader = () => (
  <LoadingState message="Loading admin dashboard..." size="lg" />
);

// Simple inline loader for minimal cases
// const InlineLoader = () => (
//   <div
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       padding: "var(--space-xl)",
//     }}
//   >
//     <LoadingSpinner size="md" />
//   </div>
// );

const MainRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={PATHS.ABOUT} element={<AboutUsPage />} />
        <Route path={PATHS.MODELS} element={<ModelsPage />} />
        <Route path={PATHS.MODEL} element={<CarModelPage />} />
        <Route path={PATHS.CHECKOUT} element={<CheckoutPage />} />
        <Route path={PATHS.LOCATIONS} element={<LocationPage />} />
        <Route path={PATHS.LOCATION} element={<LocationDetailPage />} />
        <Route path={PATHS.CONTACT} element={<ContactPage />} />
        <Route path={PATHS.SUPPORT} element={<HelpCenterPage />} />
        <Route path={PATHS.CONFIRMATION} element={<ConfirmationPage />} />
        <Route path={PATHS.POLICIES} element={<PoliciesPage />} />
        <Route path={PATHS.DISCLAIMER} element={<DisClaimer />} />
        <Route path={PATHS.BLOG} element={<Blog/>} />
        <Route path={PATHS.TERMS} element={<TermsPage />} />
        <Route path={PATHS.AGREEMENT} element={<AgreementPage />} />
        <Route path={PATHS.CAREERS} element={<CareersPage />} />
        <Route path={PATHS.CORPORATE} element={<Corporate />} />
        <Route path={PATHS.PRIVACY} element={<PrivacyPage />} />
        <Route path={PATHS.REPORTS} element={<ReportsPage/>} />

        
        <Route
          element={
            <ProtectedRoute roles={["user"]}>
              <UserAuthPage />
            </ProtectedRoute>
          }
        >
          <Route path={PATHS.PROFILE} element={<ProfilePage />} />
          <Route path={PATHS.BOOKINGS} element={<BookingsPage />} />
          <Route path={PATHS.BOOKING} element={<BookingDetailPage />} />
          <Route path={PATHS.REVIEWS} element={<CarReviewsPage />} />
          <Route path={PATHS.NOTIFICATIONS} element={<NotificationPage />} />
        </Route>
      </Route>

      {/* Auth routes */}
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      {/* <Route path={PATHS.FORGOT} element={<ForgotPasswordPage />} /> */}
         <Route path={PATHS.RESET} element={<ResetPassword />} />
      

      {/* Admin routes */}
      <Route
        element={
          <Suspense fallback={<AdminLoader />}>
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route path={ADMIN_PATHS.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ADMIN_PATHS.CARS} element={<AdminCars />} />
        <Route path={ADMIN_PATHS.ADD_CAR} element={<AddCar />} />
        <Route path={ADMIN_PATHS.EDIT_CAR} element={<EditCar />} />
        <Route path={ADMIN_PATHS.BOOKINGS} element={<AdminBookings />} />
        <Route path={ADMIN_PATHS.USERS} element={<AdminUsers />} />
        <Route path={ADMIN_PATHS.REPORTS} element={<AdminReports />} />
        <Route
          path={ADMIN_PATHS.NOTIFICATIONS}
          element={<NotificationPage />}
        />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  </Suspense>
);

export default MainRoutes;
