/* eslint-disable react/react-in-jsx-scope */
// src/app/routes/AppRoutes.jsx
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PATHS, ADMIN_PATHS } from "../../config/constants";

// Import your States components
import { LoadingState } from "../../components/ui/LoadingSpinner";

// Lazy imports - Auth
const LoginPage = lazy(() => import("../../features/auth/Login"));
const AuthSyncPage = lazy(() => import("../../features/auth/AuthSyncPage"));
const ForgotPasswordPage = lazy(() => import("../../features/auth/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("../../features/auth/ResetPasswordPage"));

// Lazy imports - Cars
const HomePage = lazy(() => import("../../features/cars/HomePage"));
const ModelsPage = lazy(() => import("../../features/cars/ModelsPage"));
const CarModelPage = lazy(() => import("../../features/cars/ModelPage"));
const LocationPage = lazy(() => import("../../features/cars/LocationPage"));
const LocationDetailPage = lazy(() => import("../../features/cars/LocationDetailPage"));
const CarReviewsPage = lazy(() => import("../../features/cars/CarReviewPage"));
const OffersPage = lazy(() => import("../../features/cars/OffersPage"));
const CompareCarsPage = lazy(() => import("../../features/cars/pages/CompareCarsPage"));

// Lazy imports - Bookings
const BookingsPage = lazy(() => import("../../features/bookings/BookingsPage"));
const BookingDetailPage = lazy(() => import("../../features/bookings/BookingDetailPage"));
const ConfirmationPage = lazy(() => import("../../features/bookings/ConfirmationPage"));
const CheckoutPage = lazy(() => import("../../features/bookings/CheckoutPage"));

// Lazy imports - Users
const ProfilePage = lazy(() => import("../../features/users/ProfilePage"));
const SettingsPage = lazy(() => import("../../features/users/SettingsPage"));
const FAQPage = lazy(() => import("../../features/users/FAQPage"));
const WishlistPage = lazy(() => import("../../features/users/pages/WishlistPage"));
const ReferralsPage = lazy(() => import("../../features/users/pages/ReferralsPage"));
const AboutUsPage = lazy(() => import("../../features/users/AboutUsPage"));
const ContactPage = lazy(() => import("../../features/users/ContactPage"));
const HelpCenterPage = lazy(() => import("../../features/users/HelpCenterPage"));
const Corporate = lazy(() => import('../../features/users/Corporate'));
const DisClaimer = lazy(() => import('../../features/users/DisClaimerPage'));
const PrivacyPage = lazy(() => import('../../features/users/PrivacyPage'));
const Blog = lazy(() => import('../../features/users/Blog'));
const AgreementPage = lazy(() => import('../../features/users/AgreementPage'));
const ReportsPage = lazy(() => import('../../features/users/ReportsPage'));
const CareersPage = lazy(() => import('../../features/users/CareersPage'));
const TermsPage = lazy(() => import('../../features/users/TermsPage'));
const PoliciesPage = lazy(() => import('../../features/users/PoliciesPage'));

// Lazy imports - Notifications
const NotificationPage = lazy(() => import("../../features/notifications/NotificationPage"));

// Lazy imports - Drivers
const DriverDashboard = lazy(() => import("../../features/drivers/pages/DriverDashboard"));

// Lazy imports - Layouts
const MainLayout = lazy(() => import("../../components/layout/MainLayout"));
const AdminLayout = lazy(() => import("../../components/layout/AdminLayout"));
const UserAuthPage = lazy(() => import("../../components/layout/UserAuthPage"));
const DriverLayout = lazy(() => import("../../components/layout/DriverLayout"));

// Lazy imports - Route Guards
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const PublicRoute = lazy(() => import("./PublicRoute"));

// Lazy imports - Error Pages
const NotFoundPage = lazy(() => import("../../app/pages/NotFoundPage"));

// Lazy imports - Admin
const AdminDashboard = lazy(() => import("../../features/admin/Dashboard"));
const AdminCars = lazy(() => import("../../features/admin/Cars"));
const AddCar = lazy(() => import("../../features/admin/AddCars"));
const EditCar = lazy(() => import("../../features/admin/EditCar"));
const AdminBookings = lazy(() => import("../../features/admin/AdminBookings"));
const AdminBookingDetailPage = lazy(() => import('../../features/admin/BookingDetailPage'));
const AdminUsers = lazy(() => import("../../features/admin/AdminUser"));
const AdminReports = lazy(() => import("../../features/admin/AdminReports"));
const DriversPage = lazy(() => import('../../features/admin/DriversPage'));
const UserDetailPage = lazy(() => import("../../features/admin/UserDetailPage"));
const ProfessionalDriverDetailPage = lazy(() => import("../../features/admin/ProfessionalDriverDetailPage"));
const AdminChatDashboard = lazy(() => import("../../features/admin/AdminChatDashboard"));
const AdminChatDetail = lazy(() => import("../../features/admin/AdminChatDetail"));
const AdminOnlineUsers = lazy(() => import("../../features/admin/AdminOnlineUsers"));
const AdminChatUsers = lazy(() => import("../../features/admin/AdminChatUsers"));
const AdminActivityDashboard = lazy(() => import("../../features/admin/AdminActivityDashboard"));

// 🔹 Custom Loader Components using your States components
const Loader = () => (
  <LoadingState message="Loading Mercedes-Benz Experience..." size="lg" />
);

const AdminLoader = () => (
  <LoadingState message="Loading admin dashboard..." size="lg" />
);

const UserLoader = () => (
  <LoadingState message="Loading your luxury dashboard..." size="lg" />
);

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* ============================================
          PUBLIC ROUTES
          ============================================
          Accessible to guests and logged-in users (customers)
          - Guests can browse all public pages
          - Logged-in users (role="user") can also access these pages
          - Drivers and admins are restricted to their own routes
      */}
      <Route element={<MainLayout />}>
        {/* Public pages - accessible to everyone */}
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.ABOUT}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <AboutUsPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.MODELS}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <ModelsPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.MODEL_DETAIL}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <CarModelPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.LOCATIONS}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <LocationPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.LOCATION_DETAIL}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <LocationDetailPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.OFFERS}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <OffersPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.COMPARE}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <CompareCarsPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.CONTACT}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <ContactPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.SUPPORT}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <HelpCenterPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.FAQ}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <FAQPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.POLICIES}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <PoliciesPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.DISCLAIMER}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <DisClaimer />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.BLOG}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <Blog />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.TERMS}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <TermsPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.AGREEMENT}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <AgreementPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.CAREERS}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <CareersPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.CORPORATE}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <Corporate />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.PRIVACY}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <PrivacyPage />
              </PublicRoute>
            </Suspense>
          }
        />
        <Route
          path={PATHS.REPORTS}
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute>
                <ReportsPage />
              </PublicRoute>
            </Suspense>
          }
        />

        {/* ============================================
            PROTECTED: User-only routes
            ============================================
            Only users (role="user") can access these routes
            - Drivers and admins are redirected to their dashboards
        */}
        <Route
          path={PATHS.CHECKOUT}
          element={
            <Suspense fallback={<UserLoader />}>
              <ProtectedRoute allowedRoles={["user"]}>
                <CheckoutPage />
              </ProtectedRoute>
            </Suspense>
          }
        />

        <Route
          path={PATHS.BOOKING_CONFIRMATION}
          element={
            <Suspense fallback={<UserLoader />}>
              <ProtectedRoute allowedRoles={["user"]}>
                <ConfirmationPage />
              </ProtectedRoute>
            </Suspense>
          }
        />

        {/* User protected routes with UserAuthPage layout */}
        <Route
          element={
            <Suspense fallback={<UserLoader />}>
              <ProtectedRoute allowedRoles={["user"]}>
                <UserAuthPage />
              </ProtectedRoute>
            </Suspense>
          }
        >
                 <Route path={PATHS.PROFILE} element={<ProfilePage />} />
                 <Route path={PATHS.SETTINGS} element={<SettingsPage />} />
                 <Route path={PATHS.WISHLIST} element={<WishlistPage />} />
                 <Route path={PATHS.REFERRALS} element={<ReferralsPage />} />
                 <Route path={PATHS.BOOKINGS} element={<BookingsPage />} />
                 <Route path={PATHS.BOOKING_DETAIL} element={<BookingDetailPage />} />
                 <Route path={PATHS.REVIEWS} element={<CarReviewsPage />} />
                 <Route path={PATHS.NOTIFICATIONS} element={<NotificationPage />} />
        </Route>
      </Route>

      {/* ============================================
          PROTECTED: Driver-only routes
          ============================================
          Only drivers (role="driver") can access these routes
          - Users and admins are redirected to their dashboards
          - Uses DriverLayout for consistent header and navigation
          - NOT nested in MainLayout to avoid user Header/Footer
      */}
      <Route
        element={
          <Suspense fallback={<UserLoader />}>
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route path={PATHS.DRIVER_DASHBOARD} element={<DriverDashboard />} />
        <Route path={PATHS.DRIVER_REQUESTS} element={<DriverDashboard />} />
        <Route path={PATHS.DRIVER_TRIPS} element={<DriverDashboard />} />
        <Route path={PATHS.DRIVER_EARNINGS} element={<DriverDashboard />} />
      </Route>

      {/* ============================================
          AUTH ROUTES (Login, Register, Forgot Password)
          ============================================
          Only accessible to guests (not logged in)
          - Logged-in users (any role) are redirected to their dashboard
      */}
      <Route
        path={PATHS.LOGIN}
        element={
          <Suspense fallback={<Loader />}>
            <PublicRoute blockRoles={["user", "driver", "admin"]}>
              <LoginPage />
            </PublicRoute>
          </Suspense>
        }
      />
      <Route
        path={PATHS.AUTH_SYNC}
        element={
          <Suspense fallback={<Loader />}>
            <PublicRoute blockRoles={["user", "driver", "admin"]}>
              <AuthSyncPage />
            </PublicRoute>
          </Suspense>
        }
      />
      <Route 
        path={PATHS.FORGOT_PASSWORD} 
        element={
          <Suspense fallback={<Loader />}>
            <PublicRoute blockRoles={["user", "driver", "admin"]}>
            <ForgotPasswordPage />
            </PublicRoute>
          </Suspense>
        } 
      />
      <Route 
        path={PATHS.RESET_PASSWORD} 
        element={
          <Suspense fallback={<Loader />}>
            <PublicRoute blockRoles={["user", "driver", "admin"]}>
            <ResetPassword />
            </PublicRoute>
          </Suspense>
        } 
      />

      {/* ============================================
          PROTECTED: Admin-only routes
          ============================================
          Only admins (role="admin") can access these routes
          - Users and drivers are redirected to their dashboards
      */}
      <Route
        element={
          <Suspense fallback={<AdminLoader />}>
            <ProtectedRoute allowedRoles={["admin"]}>
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
        <Route path={ADMIN_PATHS.BOOKING_DETAIL} element={<AdminBookingDetailPage />} />
        <Route path={ADMIN_PATHS.USERS} element={<AdminUsers />} />
        <Route path={ADMIN_PATHS.REPORTS} element={<AdminReports />} />
        <Route path={ADMIN_PATHS.DRIVERS} element={<DriversPage />} />
        <Route path={ADMIN_PATHS.USER_DETAIL} element={<UserDetailPage/>} />
        <Route
          path={ADMIN_PATHS.PROFESSIONAL_DRIVER_DETAIL}
          element={
            <Suspense fallback={<Loader />}>
              <ProfessionalDriverDetailPage />
            </Suspense>
          }
        />
        <Route
          path={ADMIN_PATHS.NOTIFICATIONS}
          element={<NotificationPage />}
        />
        <Route path={ADMIN_PATHS.CHATS} element={<AdminChatDashboard />} />
        <Route path={ADMIN_PATHS.CHAT_DETAIL} element={<AdminChatDetail />} />
        <Route path={ADMIN_PATHS.CHAT_USERS} element={<AdminChatUsers />} />
        <Route path={ADMIN_PATHS.ONLINE_USERS} element={<AdminOnlineUsers />} />
        <Route path={ADMIN_PATHS.ACTIVITY_LOGS} element={<AdminActivityDashboard />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
