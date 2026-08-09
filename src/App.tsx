import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { Toaster } from "@/components/ui/Toaster";
import { PracticeMark } from "@/components/Logo";

import LandingPage from "@/pages/LandingPage";
import PortalChooser from "@/pages/auth/PortalChooser";
import PatientLogin from "@/pages/auth/PatientLogin";
import PatientSignup from "@/pages/auth/PatientSignup";
import StaffLogin from "@/pages/auth/StaffLogin";

const SystemArchitecture = lazy(() => import("@/pages/SystemArchitecture"));
const DemoScript = lazy(() => import("@/pages/DemoScript"));

const PatientHome = lazy(() => import("@/pages/patient/PatientHome"));
const BookAppointment = lazy(() => import("@/pages/patient/BookAppointment"));
const Appointments = lazy(() => import("@/pages/patient/Appointments"));
const Billing = lazy(() => import("@/pages/patient/Billing"));
const AssistantPage = lazy(() => import("@/pages/patient/AssistantPage"));
const Profile = lazy(() => import("@/pages/patient/Profile"));

const Dashboard = lazy(() => import("@/pages/staff/Dashboard"));
const PatientRecords = lazy(() => import("@/pages/staff/PatientRecords"));
const PatientDetail = lazy(() => import("@/pages/staff/PatientDetail"));
const ResultsInbox = lazy(() => import("@/pages/staff/ResultsInbox"));
const ImagingFiles = lazy(() => import("@/pages/staff/ImagingFiles"));
const ClaimsBilling = lazy(() => import("@/pages/staff/ClaimsBilling"));
const Reports = lazy(() => import("@/pages/staff/Reports"));
const SecuritySystem = lazy(() => import("@/pages/staff/SecuritySystem"));
const UsersAccess = lazy(() => import("@/pages/staff/UsersAccess"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50">
      <div className="animate-pulse">
        <PracticeMark size={40} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/system-architecture" element={<SystemArchitecture />} />
          <Route path="/demoscript" element={<DemoScript />} />

          <Route path="/portal" element={<PortalChooser />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/staff/login" element={<StaffLogin />} />

          <Route
            path="/patient/app"
            element={
              <ProtectedRoute kind="patient">
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientHome />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="billing" element={<Billing />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route
            path="/staff/app"
            element={
              <ProtectedRoute kind="staff">
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="results" element={<ResultsInbox />} />
            <Route path="imaging" element={<ImagingFiles />} />
            <Route path="claims" element={<ClaimsBilling />} />
            <Route path="reports" element={<Reports />} />
            <Route path="security" element={<SecuritySystem />} />
            <Route path="users" element={<UsersAccess />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
