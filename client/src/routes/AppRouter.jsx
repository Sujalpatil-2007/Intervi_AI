import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import DashboardPage from "../pages/dashboard/DashboardPage";

import UploadResumePage from "../pages/resume/UploadResumePage";
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
import MyResumePage from "../pages/resume/MyResumePage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* User */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />

            <Route path="resume/upload" element={<UploadResumePage />} />

            <Route path="/resume" element={<MyResumePage />} />

            <Route path="leaderboard" element={<LeaderboardPage />} />

            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin */}

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<AdminDashboardPage />} />

            <Route path="admin/users" element={<UsersPage />} />
          </Route>
        </Route>

        {/* 404 */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
