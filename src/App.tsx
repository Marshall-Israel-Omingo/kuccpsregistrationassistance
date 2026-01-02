import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import Index from "./pages/Index";
import CoursesPage from "./pages/CoursesPage";
import PrinciplePage from "./pages/PrinciplePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfilePage from "./pages/dashboard/ProfilePage";
import ApplicationPage from "./pages/dashboard/ApplicationPage";
import DashboardCoursesPage from "./pages/dashboard/DashboardCoursesPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminTemplatesPage from "./pages/admin/settings/AdminTemplatesPage";
import AdminNotificationsPage from "./pages/admin/settings/AdminNotificationsPage";
import AdminSecurityPage from "./pages/admin/settings/AdminSecurityPage";
import AdminSystemPage from "./pages/admin/settings/AdminSystemPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/principle/:principleId" element={<PrinciplePage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/courses"
                element={
                  <ProtectedRoute>
                    <DashboardCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/application"
                element={
                  <ProtectedRoute>
                    <ApplicationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/payments"
                element={
                  <ProtectedRoute>
                    <PaymentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support"
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <AdminProtectedRoute>
                    <AdminApplicationsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <AdminProtectedRoute>
                    <AdminStudentsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminProtectedRoute>
                    <AdminPaymentsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/support"
                element={
                  <AdminProtectedRoute>
                    <AdminSupportPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminProtectedRoute>
                    <AdminReportsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings/templates"
                element={
                  <AdminProtectedRoute>
                    <AdminTemplatesPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings/notifications"
                element={
                  <AdminProtectedRoute>
                    <AdminNotificationsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings/security"
                element={
                  <AdminProtectedRoute>
                    <AdminSecurityPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings/system"
                element={
                  <AdminProtectedRoute>
                    <AdminSystemPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
