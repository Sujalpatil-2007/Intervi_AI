import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import DashboardPage from "../pages/dashboard/DashboardPage";

import UploadResumePage from "../pages/resume/UploadResumePage";
import MyResumePage from "../pages/resume/MyResumePage";
import ResumeDetailsPage from "../pages/resume/ResumeDetailsPage";

import GenerateInterviewPage from "../pages/interview/GenerateInterviewPage";
import InterviewSessionPage from "../pages/interview/InterviewSessionPage";
import InterviewResultPage from "../pages/interview/InterviewResultPage";
import LeaderboardPage from "../pages/interview/LeaderboardPage";

import ProfilePage from "../pages/profile/ProfilePage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import UserDetailsPage from "../pages/admin/UserDetailsPage";
import ResumesPage from "../pages/admin/ResumesPage";
import AdminResumeDetailsPage from "../pages/admin/ResumeDetailsPage";
import InterviewsPage from "../pages/admin/InterviewsPage";
import InterviewDetailsPage from "../pages/admin/InterviewDetailsPage";
import AnalyticsPage from "../pages/admin/AnalyticsPage";
import AuditLogsPage from "../pages/admin/AuditLogsPage";

import NotFoundPage from "../pages/public/NotFoundPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== PUBLIC ==================== */}

        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* ==================== USER ==================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Resume */}
            <Route path="resume/upload" element={<UploadResumePage />} />

            <Route path="resume" element={<MyResumePage />} />

            <Route path="resume/:id" element={<ResumeDetailsPage />} />

            {/* Interview */}
            <Route
              path="interview/generate"
              element={<GenerateInterviewPage />}
            />

            <Route path="interview/:id" element={<InterviewDetailsPage />} />

            <Route
              path="interview/:id/session"
              element={<InterviewSessionPage />}
            />

            <Route
              path="interview/:id/result"
              element={<InterviewResultPage />}
            />

            {/* Other */}
            <Route path="leaderboard" element={<LeaderboardPage />} />

            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ==================== ADMIN ==================== */}

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<AdminDashboardPage />} />

            <Route path="admin/users" element={<UsersPage />} />

            <Route path="admin/users/:id" element={<UserDetailsPage />} />

            <Route path="admin/resumes" element={<ResumesPage />} />

            <Route
              path="admin/resumes/:id"
              element={<AdminResumeDetailsPage />}
            />

            <Route path="admin/interviews" element={<InterviewsPage />} />

            <Route
              path="admin/interviews/:id"
              element={<InterviewDetailsPage />}
            />

            <Route path="admin/analytics" element={<AnalyticsPage />} />

            <Route path="admin/logs" element={<AuditLogsPage />} />
          </Route>
        </Route>

        {/* ==================== 404 ==================== */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
