# Unused Files in Frontend

This document lists all unused files in the frontend that can be safely deleted.

## Summary
- **Total unused files identified:** ~50+ files
- **Categories:** Duplicate files, old route files, unused pages, test files, old component locations

---

## 🗑️ Files Safe to Delete

### 1. Duplicate/Unused Route Files
- ✅ **`src/routes/MainRoutes.jsx`** - Unused (app uses `app/routes/AppRoutes.jsx`)
- ✅ **`src/routes/protectedRoute.jsx`** - Unused (app uses `app/routes/ProtectedRoute.jsx`)
- ✅ **`src/routes/RedirectAdmin.jsx`** - Duplicate (app uses `app/routes/RedirectAdmin.jsx`)
- ✅ **`src/routes/routePaths.js`** - Unused (app uses `config/constants.js`)

### 2. Duplicate/Unused App Entry Point
- ✅ **`src/App.jsx`** - Unused (app uses `app/App.jsx`)

### 3. Duplicate CheckoutPage
- ✅ **`src/pages/CheckoutPage.jsx`** - Only imported by unused `MainRoutes.jsx`
  - **Note:** The active version is `features/bookings/CheckoutPage.jsx`

### 4. Old Layout Folder (if components/layout/ is used)
The `src/Layout/` folder appears to be unused. Check if these are imported:
- ⚠️ **`src/Layout/Header.jsx`** - Check if used
- ⚠️ **`src/Layout/AdminLayout.jsx`** - Check if used
- ⚠️ **`src/Layout/AdminHeader.jsx`** - Check if used
- ⚠️ **`src/Layout/Footer.jsx`** - Check if used
- ⚠️ **`src/Layout/CarGrid.jsx`** - Check if used
- ⚠️ **`src/Layout/UserAuthPage.jsx`** - Check if used
- ⚠️ **`src/Layout/Container.jsx`** - Check if used
- ⚠️ **`src/Layout/MainLayout.jsx`** - Check if used
- ⚠️ **`src/Layout/AdminSidebar.jsx`** - Check if used

**Note:** These are imported by `pages/HomePage.jsx` and `routes/MainRoutes.jsx`, which may be unused.

### 5. Old Auth Folder (if features/auth/ is used)
- ⚠️ **`src/Auth/Login.jsx`** - Check if used (app uses `features/auth/Login`)
- ⚠️ **`src/Auth/ForgotPasswordPage.jsx`** - Check if used (app uses `features/auth/ForgotPasswordPage`)
- ⚠️ **`src/Auth/ResetPasswordPage.jsx`** - Check if used (app uses `features/auth/ResetPasswordPage`)

### 6. Duplicate/Unused Pages
These pages in `src/pages/` may be unused if `features/` versions are used:

- ⚠️ **`src/pages/HomePage.jsx`** - Check if used (app uses `features/cars/HomePage`)
- ⚠️ **`src/pages/ModelsPage.jsx`** - Check if used (app uses `features/cars/ModelsPage`)
- ⚠️ **`src/pages/ModelPage.jsx`** - Check if used (app uses `features/cars/ModelPage`)
- ⚠️ **`src/pages/BookingsPage.jsx`** - Check if used (app uses `features/bookings/BookingsPage`)
- ⚠️ **`src/pages/BookingDetailPage.jsx`** - Check if used (app uses `features/bookings/BookingDetailPage`)
- ⚠️ **`src/pages/ConfirmationPage.jsx`** - Check if used (app uses `features/bookings/ConfirmationPage`)
- ⚠️ **`src/pages/ProfilePage.jsx`** - Check if used (app uses `features/users/ProfilePage`)
- ⚠️ **`src/pages/AuthSyncPage.jsx`** - Check if used (app uses `features/auth/AuthSyncPage`)
- ⚠️ **`src/pages/CarReviewPage.jsx`** - Check if used (app uses `features/cars/CarReviewPage`)
- ⚠️ **`src/pages/NotificatioPage.jsx`** - Check if used (app uses `features/notifications/NotificationPage`)
- ⚠️ **`src/pages/AboutUsPage.jsx`** - Check if used (app uses `features/users/AboutUsPage`)
- ⚠️ **`src/pages/ContactPage.jsx`** - Check if used (app uses `features/users/ContactPage`)
- ⚠️ **`src/pages/HelpCenterPage.jsx`** - Check if used (app uses `features/users/HelpCenterPage`)
- ⚠️ **`src/pages/Corporate.jsx`** - Check if used (app uses `features/users/Corporate`)
- ⚠️ **`src/pages/DisClaimerPage.jsx`** - Check if used (app uses `features/users/DisClaimerPage`)
- ⚠️ **`src/pages/PrivacyPage.jsx`** - Check if used (app uses `features/users/PrivacyPage`)
- ⚠️ **`src/pages/Blog.jsx`** - Check if used (app uses `features/users/Blog`)
- ⚠️ **`src/pages/AgreementPage.jsx`** - Check if used (app uses `features/users/AgreementPage`)
- ⚠️ **`src/pages/ReportsPages.jsx`** - Check if used (app uses `features/users/ReportsPage`)
- ⚠️ **`src/pages/CareersPage.jsx`** - Check if used (app uses `features/users/CareersPage`)
- ⚠️ **`src/pages/TermsPage.jsx`** - Check if used (app uses `features/users/TermsPage`)
- ⚠️ **`src/pages/PoliciesPage.jsx`** - Check if used (app uses `features/users/PoliciesPage`)
- ⚠️ **`src/pages/LocationPage.jsx`** - Check if used (app uses `features/cars/LocationPage`)
- ⚠️ **`src/pages/LocationDetailPage.jsx`** - Check if used (app uses `features/cars/LocationDetailPage`)

### 7. Old Admin Pages
- ⚠️ **`src/pages/adminPages/`** (entire folder) - Check if used (app uses `features/admin/`)

### 8. Duplicate Components
- ⚠️ **`src/components/BookingSummarySection.jsx`** - Check if used (app uses `features/bookings/BookingSummarySection`)
- ⚠️ **`src/components/BookingCardList.jsx`** - Check if used (app uses `features/bookings/BookingCardList`)
- ⚠️ **`src/components/BookingStats.jsx`** - Check if used (app uses `features/bookings/BookingStats`)
- ⚠️ **`src/components/BookingTable.jsx`** - Check if used (app uses `features/bookings/BookingTable`)
- ⚠️ **`src/components/MobileBookingForm.jsx`** - Check if used (app uses `features/bookings/MobileBookingForm`)
- ⚠️ **`src/components/CalendarDatePicker.jsx`** - Check if used (app uses `features/bookings/CalendarDatePicker`)
- ⚠️ **`src/components/DriverDocument.jsx`** - Check if used (app uses `features/drivers/DriverDocument`)
- ⚠️ **`src/components/DriverServiceSelector.jsx`** - Check if used (app uses `features/drivers/DriverServiceSelector`)
- ⚠️ **`src/components/MobileAuthSync.jsx`** - Check if used (app uses `features/auth/MobileAuthSync`)
- ⚠️ **`src/components/CookieConsent.jsx`** - Check if used (app uses `components/feedback/CookieConsent`)
- ⚠️ **`src/components/CarDetails.jsx`** - Check if used (app uses `features/cars/CarDetails`)
- ⚠️ **`src/components/CarReviews.jsx`** - Check if used (app uses `features/cars/CarReviews`)
- ⚠️ **`src/components/ReviewSection.jsx`** - Check if used (app uses `features/cars/ReviewSection`)
- ⚠️ **`src/components/ModelSideTab.jsx`** - Check if used (app uses `features/cars/ModelSideTab`)
- ⚠️ **`src/components/NotificationBell.jsx`** - Check if used (app uses `features/notifications/NotificationBell`)

### 9. Old Modal Components
- ⚠️ **`src/components/Modal/`** (entire folder) - Check if used (app uses `components/ui/`)

### 10. Duplicate Hooks (if features/ versions are used)
- ⚠️ **`src/hooks/useAuth.js`** - Check if used (app uses `features/auth/useAuth`)
- ⚠️ **`src/hooks/useBooking.js`** - Check if used (app uses `features/bookings/useBooking`)
- ⚠️ **`src/hooks/useCar.js`** - Check if used (app uses `features/cars/useCar`)
- ⚠️ **`src/hooks/useDriver.js`** - Check if used (app uses `features/drivers/useDriver`)
- ⚠️ **`src/hooks/usePayment.js`** - Check if used (app uses `features/payments/usePayment`)
- ⚠️ **`src/hooks/useProfessionalDriver.js`** - Check if used (app uses `features/drivers/useProfessionalDriver`)
- ⚠️ **`src/hooks/useReview.js`** - Check if used (app uses `features/cars/useReview`)
- ⚠️ **`src/hooks/useUser.js`** - Check if used (app uses `features/users/useUser`)
- ⚠️ **`src/hooks/useNotification.js`** - Check if used (app uses `features/notifications/useNotification`)
- ⚠️ **`src/hooks/usePageTitle.js`** - Check if used (app uses `app/hooks/usePageTitle`)
- ⚠️ **`src/hooks/useCookieConsent.jsx`** - Check if used (app uses `app/hooks/useCookieConsent`)

### 11. Old Services (if features/ versions are used)
- ⚠️ **`src/services/authApi.js`** - Check if used (app uses `features/auth/authService`)
- ⚠️ **`src/services/bookingApi.js`** - Check if used (app uses `features/bookings/bookingService`)
- ⚠️ **`src/services/carApi.js`** - Check if used (app uses `features/cars/carService`)
- ⚠️ **`src/services/driverApi.js`** - Check if used (app uses `features/drivers/driverService`)
- ⚠️ **`src/services/paymentApi.js`** - Check if used (app uses `features/payments/paymentService`)
- ⚠️ **`src/services/professionalDriverApi.js`** - Check if used (app uses `features/drivers/professionalDriverService`)
- ⚠️ **`src/services/reviewApi.js`** - Check if used (app uses `features/cars/reviewService`)
- ⚠️ **`src/services/userApi.js`** - Check if used (app uses `features/users/userService`)
- ⚠️ **`src/services/notificationApi.js`** - Check if used (app uses `features/notifications/notificationService`)

### 12. Test Files (Safe to delete if not running tests)
- ✅ **`src/hooks/useAuth.test.jsx`**
- ✅ **`src/hooks/useBooking.test.jsx`**
- ✅ **`src/hooks/useCar.test.jsx`**
- ✅ **`src/hooks/useDriver.test.jsx`**
- ✅ **`src/hooks/useNotification.test.jsx`**
- ✅ **`src/hooks/usePageTitle.test.jsx`**
- ✅ **`src/hooks/usePayment.test.jsx`**
- ✅ **`src/hooks/useReview.test.jsx`**
- ✅ **`src/hooks/useUser.test.jsx`**
- ✅ **`src/pages/HomePage.test.jsx`**
- ✅ **`src/services/authApi.test.js`**
- ✅ **`src/services/bookingApi.test.js`**
- ✅ **`src/services/carApi.test.js`**
- ✅ **`src/services/driverApi.test.js`**
- ✅ **`src/services/notificationApi.test.js`**
- ✅ **`src/services/paymentApi.test.js`**
- ✅ **`src/services/reviewApi.test.js`**
- ✅ **`src/services/userApi.test.js`**
- ✅ **`src/utils/dateTimeUtils.test.js`**
- ✅ **`src/utils/helper.test.js`**
- ✅ **`src/utils/path.test.js`**
- ✅ **`src/utils/tokenService.test.js`**
- ✅ **`src/utils/usaDateTime.test.js`**

---

## ⚠️ Files to Verify Before Deleting

These files might still be used. Verify by searching for imports:

1. **Layout folder** - Check if `components/layout/` is the active version
2. **Pages folder** - Check if `features/` versions are the active ones
3. **Old hooks/services** - Check if `features/` versions are the active ones
4. **Old components** - Check if `features/` or `components/` versions are active

---

## 🔍 How to Verify

Before deleting, search for imports:

```bash
# Check if a file is imported anywhere
grep -r "from.*pages/CheckoutPage" src/
grep -r "import.*pages/CheckoutPage" src/

# Check if Layout folder is used
grep -r "from.*Layout/" src/
grep -r "import.*Layout/" src/
```

---

## 📝 Notes

- The app currently uses `app/App.jsx` and `app/routes/AppRoutes.jsx`
- Most features have been moved to `features/` folder
- Old `pages/`, `hooks/`, `services/` folders may contain duplicates
- Test files are safe to delete if you're not running tests

---

## 🚀 Recommended Action Plan

1. **Phase 1: Safe Deletes** (No verification needed)
   - Delete test files (if not running tests)
   - Delete `src/App.jsx`
   - Delete `src/routes/MainRoutes.jsx`
   - Delete `src/routes/protectedRoute.jsx`
   - Delete `src/routes/routePaths.js`
   - Delete `src/pages/CheckoutPage.jsx`

2. **Phase 2: Verify Then Delete**
   - Search for imports of Layout/ folder files
   - Search for imports of pages/ folder files
   - Search for imports of old hooks/services
   - Delete if not found

3. **Phase 3: Clean Up**
   - Remove empty folders
   - Update any remaining import paths
   - Run build to verify no broken imports

