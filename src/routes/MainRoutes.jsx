import { Route, Routes } from "react-router-dom";
import { PATHS, ADMIN_PATHS } from "./routePaths";
import { lazy, Suspense } from "react";

// Lazy imports
const ProtectedRoute = lazy(() => import("../routes/protectedRoute"));
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
// Layouts
const MainLayout = lazy(() => import("../Layout/MainLayout"));
const AdminLayout = lazy(() => import("../Layout/AdminLayout"));
const UserAuthPage = lazy(() => import("../Layout/UserAuthPage")); // ✅ this is your user layout

// Admin pages
const AdminDashboard = lazy(() => import("../pages/adminPages/Dashboard"));
const AdminCars = lazy(() => import("../pages/adminPages/Cars"));
const AddCar = lazy(() => import("../pages/adminPages/AddCars"));
const EditCar = lazy(() => import("../pages/adminPages/EditCar"));
const AdminBookings = lazy(() => import("../pages/adminPages/AdminBookings"));
const AdminUsers = lazy(() => import("../pages/adminPages/AdminUser"));
const AdminReports = lazy(() => import("../pages/adminPages/AdminReports"));
const NotificationPage = lazy(() =>
  import("../pages/adminPages/NotificationPage")
);

// 🔹 Loaders
const Loader = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
);
const UserLoader = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    Loading user dashboard...
  </div>
);
const AdminLoader = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    Loading admin dashboard...
  </div>
);

const MainRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.MODELS} element={<ModelsPage />} />
        <Route path={PATHS.MODEL} element={<CarModelPage />} />
        <Route path={PATHS.LOCATIONS} element={<LocationPage />} />
        <Route path={PATHS.LOCATION} element={<LocationDetailPage />} />
        <Route path={PATHS.CONTACT} element={<ContactPage />} />
        <Route path={PATHS.HELP_CENTER} element={<HelpCenterPage />} />
        <Route path={PATHS.CONFIRMATION} element={<ConfirmationPage />} />
        <Route path={PATHS.CHECKOUT} element={<CheckoutPage />} />
        <Route
          element={
            <ProtectedRoute roles={["user"]}>
              <UserAuthPage /> {/* keep normal import */}
            </ProtectedRoute>
          }
        >
          <Route path={PATHS.PROFILE} element={<ProfilePage />} />
          <Route path={PATHS.BOOKINGS} element={<BookingsPage />} />
          <Route path={PATHS.BOOKING} element={<BookingDetailPage />} />
          <Route path={PATHS.REVIEWS} element={<CarReviewsPage />} />
        </Route>
      </Route>

      {/* ✅ Authenticated user routes with UserAuthLayout */}

      {/* Auth routes */}
      <Route path={PATHS.LOGIN} element={<LoginPage />} />

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
