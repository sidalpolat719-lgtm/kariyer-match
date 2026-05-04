import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import MatchingPage from "./pages/MatchingPage";
import InternshipDetailPage from "./pages/InternshipDetailPage";
import ProfilePage from "./pages/ProfilePage";
import MessagingPage from "./pages/MessagingPage";
import RoadmapPage from "./pages/RoadmapPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import SettingsPage from "./pages/SettingsPage";
import { AppShell } from "./components/layout/AppShell";
import { CompanyShell } from "./components/layout/CompanyShell";
import CompanyOverviewPage from "./pages/company/CompanyOverviewPage";
import CompanyTalentPage from "./pages/company/CompanyTalentPage";
import CompanyPostingsPage from "./pages/company/CompanyPostingsPage";
import CompanyPipelinePage from "./pages/company/CompanyPipelinePage";
import CompanyInterviewsPage from "./pages/company/CompanyInterviewsPage";
import CompanyAnalyticsPage from "./pages/company/CompanyAnalyticsPage";
import CompanyMessagesPage from "./pages/company/CompanyMessagesPage";
import CompanyBrandPage from "./pages/company/CompanyBrandPage";
import CompanyTeamPage from "./pages/company/CompanyTeamPage";
import CompanyBillingPage from "./pages/company/CompanyBillingPage";
import CompanySettingsPage from "./pages/company/CompanySettingsPage";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children, allow }: { children: React.ReactNode; allow?: "student" | "company" }) {
  const { isAuthed, user } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (allow === "student" && user?.role === "company") {
    return <Navigate to="/company" replace />;
  }
  if (allow === "company" && user?.role !== "company") {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allow="student">
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

function CompanyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allow="company">
      <CompanyShell>{children}</CompanyShell>
    </ProtectedRoute>
  );
}

function PostLoginRedirect() {
  const { user } = useAuth();
  if (user?.role === "company") return <Navigate to="/company" replace />;
  return <Navigate to="/app" replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/internships/:id" element={<InternshipDetailPage />} />

        {/* Auto-redirect after login */}
        <Route path="/dashboard" element={<PostLoginRedirect />} />

        {/* Student panel */}
        <Route path="/app" element={<StudentRoute><StudentDashboardPage /></StudentRoute>} />
        <Route path="/app/matches" element={<StudentRoute><MatchingPage /></StudentRoute>} />
        <Route path="/app/internships" element={<StudentRoute><MatchingPage /></StudentRoute>} />
        <Route path="/app/saved" element={<StudentRoute><MatchingPage /></StudentRoute>} />
        <Route path="/app/applications" element={<StudentRoute><ApplicationsPage /></StudentRoute>} />
        <Route path="/app/roadmap" element={<StudentRoute><RoadmapPage /></StudentRoute>} />
        <Route path="/app/mentors" element={<StudentRoute><RoadmapPage /></StudentRoute>} />
        <Route path="/app/messages" element={<StudentRoute><MessagingPage /></StudentRoute>} />
        <Route path="/app/profile" element={<StudentRoute><ProfilePage /></StudentRoute>} />
        <Route path="/app/settings" element={<StudentRoute><SettingsPage /></StudentRoute>} />

        {/* Company panel */}
        <Route path="/company" element={<CompanyRoute><CompanyOverviewPage /></CompanyRoute>} />
        <Route path="/company/talent" element={<CompanyRoute><CompanyTalentPage /></CompanyRoute>} />
        <Route path="/company/postings" element={<CompanyRoute><CompanyPostingsPage /></CompanyRoute>} />
        <Route path="/company/pipeline" element={<CompanyRoute><CompanyPipelinePage /></CompanyRoute>} />
        <Route path="/company/interviews" element={<CompanyRoute><CompanyInterviewsPage /></CompanyRoute>} />
        <Route path="/company/analytics" element={<CompanyRoute><CompanyAnalyticsPage /></CompanyRoute>} />
        <Route path="/company/messages" element={<CompanyRoute><CompanyMessagesPage /></CompanyRoute>} />
        <Route path="/company/brand" element={<CompanyRoute><CompanyBrandPage /></CompanyRoute>} />
        <Route path="/company/team" element={<CompanyRoute><CompanyTeamPage /></CompanyRoute>} />
        <Route path="/company/billing" element={<CompanyRoute><CompanyBillingPage /></CompanyRoute>} />
        <Route path="/company/settings" element={<CompanyRoute><CompanySettingsPage /></CompanyRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
