# BenzFlex Frontend Restructure - Migration Notes

## Overview
This document tracks the migration from a flat structure to a feature-based architecture.

## New Folder Structure

```
src/
├── app/
│   ├── providers/            # React Query, Theme providers
│   ├── routes/               # AppRoutes.jsx, ProtectedRoute.jsx
│   ├── hooks/                # Global hooks (usePageTitle, useCookieConsent)
│   └── App.jsx               # Main app component
│
├── features/                 # Feature-based folders
│   ├── auth/                 # Login, Signup, Password Reset, AuthSync
│   ├── cars/                 # Car listing, Car detail, Reviews
│   ├── bookings/             # Booking flow, details, status
│   ├── payments/             # Stripe checkout, receipts
│   ├── users/                # User dashboard, profile, static pages
│   ├── drivers/              # Driver management, verification
│   ├── admin/                # Admin analytics, car control
│   └── notifications/        # Alerts, unread counts
│
├── components/               # Shared/reusable UI
│   ├── ui/                   # Buttons, Inputs, Modals, Grid, etc.
│   ├── layout/               # Header, Footer, Sidebar, MainLayout
│   └── feedback/             # Toasts, Loaders, EmptyState, CookieConsent
│
├── services/                 # Centralized API clients
│   └── apiClient.js          # Main axios instance
│
├── styles/                   # Global styles and theme config
│   ├── GlobalStyles.js
│   ├── theme.js
│   └── animations.js
│
├── utils/                    # Helper functions and formatters
│   ├── dateTimeUtils.js
│   ├── helper.js
│   └── tokenService.js
│
├── config/                   # Env + constants
│   └── constants.js          # Route paths (moved from routes/routePaths.js)
│
├── index.js
└── main.jsx
```

## Files Moved

### Routes
- `routes/MainRoutes.jsx` → `app/routes/AppRoutes.jsx`
- `routes/protectedRoute.jsx` → `app/routes/ProtectedRoute.jsx`
- `routes/RedirectAdmin.jsx` → `app/routes/RedirectAdmin.jsx`
- `routes/routePaths.js` → `config/constants.js`

### Auth Feature
- `Auth/Login.jsx` → `features/auth/Login.jsx`
- `Auth/ForgotPasswordPage.jsx` → `features/auth/ForgotPasswordPage.jsx`
- `Auth/ResetPasswordPage.jsx` → `features/auth/ResetPasswordPage.jsx`
- `pages/AuthSyncPage.jsx` → `features/auth/AuthSyncPage.jsx`
- `hooks/useAuth.js` → `features/auth/useAuth.js`
- `services/authApi.js` → `features/auth/authService.js`
- `components/MobileAuthSync.jsx` → `features/auth/MobileAuthSync.jsx`
- `components/OtpInput.jsx` → `features/auth/OtpInput.jsx`
- `components/PasswordStrengthIndicator.jsx` → `features/auth/PasswordStrengthIndicator.jsx`

### Cars Feature
- `pages/HomePage.jsx` → `features/cars/HomePage.jsx`
- `pages/ModelsPage.jsx` → `features/cars/ModelsPage.jsx`
- `pages/ModelPage.jsx` → `features/cars/ModelPage.jsx`
- `pages/LocationPage.jsx` → `features/cars/LocationPage.jsx`
- `pages/LocationDetailPage.jsx` → `features/cars/LocationDetailPage.jsx`
- `pages/CarReviewPage.jsx` → `features/cars/CarReviewPage.jsx`
- `components/CarDetails.jsx` → `features/cars/CarDetails.jsx`
- `components/CarReviews.jsx` → `features/cars/CarReviews.jsx`
- `components/ReviewSection.jsx` → `features/cars/ReviewSection.jsx`
- `components/Cards/*` → `features/cars/`
- `components/ModelSideTab.jsx` → `features/cars/ModelSideTab.jsx`
- `components/MobileCard.jsx` → `features/cars/MobileCard.jsx`
- `hooks/useCar.js` → `features/cars/useCar.js`
- `hooks/useReview.js` → `features/cars/useReview.js`
- `services/carApi.js` → `features/cars/carService.js`
- `services/reviewApi.js` → `features/cars/reviewService.js`

### Bookings Feature
- `pages/BookingsPage.jsx` → `features/bookings/BookingsPage.jsx`
- `pages/BookingDetailPage.jsx` → `features/bookings/BookingDetailPage.jsx`
- `pages/CheckoutPage.jsx` → `features/bookings/CheckoutPage.jsx`
- `pages/ConfirmationPage.jsx` → `features/bookings/ConfirmationPage.jsx`
- `components/BookingCardList.jsx` → `features/bookings/BookingCardList.jsx`
- `components/BookingStats.jsx` → `features/bookings/BookingStats.jsx`
- `components/BookingSummarySection.jsx` → `features/bookings/BookingSummarySection.jsx`
- `components/BookingTable.jsx` → `features/bookings/BookingTable.jsx`
- `components/forms/BookingForm.jsx` → `features/bookings/BookingForm.jsx`
- `components/forms/Form.jsx` → `features/bookings/Form.jsx`
- `components/MobileBookingForm.jsx` → `features/bookings/MobileBookingForm.jsx`
- `components/CalendarDatePicker.jsx` → `features/bookings/CalendarDatePicker.jsx`
- `hooks/useBooking.js` → `features/bookings/useBooking.js`
- `services/bookingApi.js` → `features/bookings/bookingService.js`

### Payments Feature
- `hooks/usePayment.js` → `features/payments/usePayment.js`
- `services/paymentApi.js` → `features/payments/paymentService.js`

### Users Feature
- `pages/ProfilePage.jsx` → `features/users/ProfilePage.jsx`
- `pages/AboutUsPage.jsx` → `features/users/AboutUsPage.jsx`
- `pages/ContactPage.jsx` → `features/users/ContactPage.jsx`
- `pages/HelpCenterPage.jsx` → `features/users/HelpCenterPage.jsx`
- `pages/AgreementPage.jsx` → `features/users/AgreementPage.jsx`
- `pages/Blog.jsx` → `features/users/Blog.jsx`
- `pages/CareersPage.jsx` → `features/users/CareersPage.jsx`
- `pages/Corporate.jsx` → `features/users/Corporate.jsx`
- `pages/DisClaimerPage.jsx` → `features/users/DisClaimerPage.jsx`
- `pages/PoliciesPage.jsx` → `features/users/PoliciesPage.jsx`
- `pages/PrivacyPage.jsx` → `features/users/PrivacyPage.jsx`
- `pages/ReportsPages.jsx` → `features/users/ReportsPage.jsx`
- `pages/TermsPage.jsx` → `features/users/TermsPage.jsx`
- `hooks/useUser.js` → `features/users/useUser.js`
- `services/userApi.js` → `features/users/userService.js`

### Drivers Feature
- `components/DriverDocument.jsx` → `features/drivers/DriverDocument.jsx`
- `components/DriverServiceSelector.jsx` → `features/drivers/DriverServiceSelector.jsx`
- `hooks/useDriver.js` → `features/drivers/useDriver.js`
- `hooks/useProfessionalDriver.js` → `features/drivers/useProfessionalDriver.js`
- `services/driverApi.js` → `features/drivers/driverService.js`
- `services/professionalDriverApi.js` → `features/drivers/professionalDriverService.js`

### Admin Feature
- `pages/adminPages/*` → `features/admin/*`
- All admin pages moved to `features/admin/`

### Notifications Feature
- `pages/NotificatioPage.jsx` → `features/notifications/NotificationPage.jsx`
- `components/NotificationBell.jsx` → `features/notifications/NotificationBell.jsx`
- `hooks/useNotification.js` → `features/notifications/useNotification.js`
- `services/notificationApi.js` → `features/notifications/notificationService.js`

### Components
- `Layout/*` → `components/layout/*`
- `components/ui/*` → `components/ui/*` (kept)
- `components/Modal/*` → `components/ui/*`
- `components/CookieConsent.jsx` → `components/feedback/CookieConsent.jsx`
- `components/ErrorState.jsx` → `components/feedback/ErrorState.jsx`
- `components/Grid.jsx` → `components/ui/Grid.jsx`
- `components/Pagination.jsx` → `components/ui/Pagination.jsx`
- `components/StatusBadgeComponent.jsx` → `components/ui/StatusBadge.jsx`
- `components/ModalWrapper.jsx` → `components/ui/Modal.jsx`
- `components/Sections/*` → `components/ui/*`

### Services
- `services/api.js` → `services/apiClient.js` (renamed)

### Hooks
- `hooks/usePageTitle.js` → `app/hooks/usePageTitle.js`
- `hooks/useCookieConsent.jsx` → `app/hooks/useCookieConsent.jsx`

### Config
- `utils/path.js` → `config/env.js` (partial - route paths moved to constants.js)

## Import Path Updates

### Common Patterns

1. **Within Features** - Use relative paths within the same feature:
   - `./useAuth` instead of `../hooks/useAuth`
   - `./authService` instead of `../services/authApi`

2. **Cross-Feature** - Use feature-relative paths:
   - `../../features/auth/useAuth` for auth hooks from other features
   - `../../components/ui/Button` for shared UI components
   - `../../components/layout/MainLayout` for layouts

3. **Global Hooks** - Use app-relative paths:
   - `../../app/hooks/usePageTitle` for global hooks

4. **Services** - All services import from:
   - `../../services/apiClient` for the main API instance

5. **Config** - Use config-relative paths:
   - `../../config/constants` for route paths and constants

## Remaining Work

### Import Fixes Needed
Many files still have old import paths. Common fixes needed:

1. Update all `../hooks/useX` → `./useX` (within features)
2. Update all `../services/XApi` → `./XService` (within features)
3. Update all `../components/ui/X` → `../../components/ui/X`
4. Update all `../components/forms/Form` → `../../features/bookings/Form`
5. Update all `../Layout/X` → `../../components/layout/X`
6. Update all `../routes/routePaths` → `../../config/constants`
7. Update all `../styles/X` → `../../styles/X`
8. Update all `../utils/X` → `../../utils/X`

### Testing Required
- [ ] All routes load correctly
- [ ] Authentication flow works
- [ ] Booking flow works
- [ ] Admin pages load
- [ ] All API calls succeed
- [ ] No console errors

## Build Status

The project is in progress. Run `npm run build` to see remaining import errors and fix them iteratively.

## Next Steps

1. Continue fixing import paths as build errors appear
2. Test each feature module independently
3. Verify all routes work
4. Test in development mode
5. Run full test suite if available

