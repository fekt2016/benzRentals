import { Route, Routes } from "react-router-dom";
import { PATHS } from "./routePaths";
import { lazy } from "react";

const BookingDetailPage = lazy(() => import("../pages/BookingDetailPage"));
const MainLayout = lazy(() => import("../Layout/MainLayout"));
const HomePage = lazy(() => import("../pages/HomePage"));
const ModelsPage = lazy(() => import("../pages/ModelsPage"));
const CarModelPage = lazy(() => import("../pages/ModelPage"));
const LocationPage = lazy(() => import("../pages/LocationPage"));
const LocationDetailPage = lazy(() => import("../pages/LocationDetailPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const HelpCenterPage = lazy(() => import("../pages/HelpCenterPage"));
const BookingsPage = lazy(() => import("../pages/BookingsPage"));
const ConfirmationPage = lazy(() => import("../pages/ConfirmationPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const LoginPage = lazy(() => import("../Auth/Login"));
const RegisterPage = lazy(() => import("../Auth/Register"));
const MainRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path={PATHS.HOME} element={<HomePage />} />
      <Route path={PATHS.MODELS} element={<ModelsPage />} />
      <Route path={PATHS.MODEL} element={<CarModelPage />} />
    </Route>

    <Route path={PATHS.LOCATIONS} element={<LocationPage />} />
    <Route path={PATHS.LOCATION} element={<LocationDetailPage />} />
    <Route path={PATHS.CONTACT} element={<ContactPage />} />
    <Route path={PATHS.HELP_CENTER} element={<HelpCenterPage />} />
    <Route path={PATHS.BOOKINGS} element={<BookingsPage />} />
    <Route path={PATHS.CONFIRMATION} element={<ConfirmationPage />} />
    <Route path={PATHS.CHECKOUT} element={<CheckoutPage />} />
    <Route path={PATHS.BOOKING} element={<BookingDetailPage />} />
    <Route path={PATHS.LOGIN} element={<LoginPage />} />
    <Route path={PATHS.SIGNUP} element={<RegisterPage />} />
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
);
export default MainRoutes;
