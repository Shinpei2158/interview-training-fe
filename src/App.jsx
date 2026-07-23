import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/Toast/ToastContainer";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyRegisterPage from "./pages/VerifyRegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyForgotPasswordPage from "./pages/VerifyForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import MainLayout from "./layouts/MainLayout";
import QuizPage from "./pages/user/QuizPage";
import FindInterviewPage from "./pages/user/FindInterviewPage";
import MyInterviewSchedulePage from "./pages/user/MyInterviewSchedulePage";
import InterviewerProfilePage from "./pages/user/InterviewerProfilePage";
import InterviewerRequestsPage from "./pages/user/InterviewerRequestsPage";
import InterviewerSchedulePage from "./pages/user/InterviewerSchedulePage";
import InterviewerQuizListPage from "./pages/user/InterviewerQuizListPage";
import InterviewerQuizEditorPage from "./pages/user/InterviewerQuizEditorPage";
import StudyQuizPage from "./pages/user/StudyQuizPage";
import TestQuizPage from "./pages/user/TestQuizPage";
import SavedQuestionsPage from "./pages/user/SavedQuestionsPage";
import QuizProgressPage from "./pages/user/QuizProgressPage";
import LikedQuizzesPage from "./pages/user/LikedQuizzesPage";
import ProfilePage from "./pages/user/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import VirtualRoomPage from "./pages/user/VirtualRoomPage";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/verify" element={<VerifyRegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/forgot-password/verify"
              element={<VerifyForgotPasswordPage />}
            />
          </Route>

          <Route path="/" element={<HomePage />} />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["USER", "INTERVIEWER", "ADMIN"]}
              />
            }
          >
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["USER", "INTERVIEWER", "ADMIN"]}
                />
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
              <Route path="/quiz" element={<QuizPage />} />
              <Route
                path="/quizzes/:quizId/study"
                element={<StudyQuizPage />}
              />
              <Route path="/quizzes/:quizId/test" element={<TestQuizPage />} />
              <Route path="/quiz/saved" element={<SavedQuestionsPage />} />
              <Route path="/quiz/liked" element={<LikedQuizzesPage />} />
              <Route path="/my-progress" element={<QuizProgressPage />} />
              <Route path="/interview" element={<FindInterviewPage />} />
              <Route
                path="/interview/schedule"
                element={<MyInterviewSchedulePage />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["INTERVIEWER"]} />}>
              <Route
                path="/interviewer/profile"
                element={<InterviewerProfilePage />}
              />
              <Route
                path="/interviewer/requests"
                element={<InterviewerRequestsPage />}
              />
              <Route
                path="/interviewer/schedule"
                element={<InterviewerSchedulePage />}
              />
              <Route
                path="/interviewer/quiz"
                element={<InterviewerQuizListPage />}
              />
              <Route
                path="/interviewer/quiz/:quizId/edit"
                element={<InterviewerQuizEditorPage />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["USER", "INTERVIEWER"]} />}>
            <Route path="/interview/room/:bookingId" element={<VirtualRoomPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

