import { Switch, Route, useLocation } from "wouter";
import { AuthProvider } from "@/features/auth/authStore";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useEffect } from "react";

// Layout Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Practice from "@/pages/Practice";
import StudyTools from "@/pages/StudyTools";
import Listening from "@/pages/Listening";
import Reading from "@/pages/Reading";
import Admin from "@/pages/Admin";
import Results from "@/pages/Result";
import Jointest from "@/pages/Jointest";
import Dashboard from "@/pages/Dashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import TeacherLogin from "@/pages/Teacher-login";
import Support from "@/pages/Support";
import NotFound from "@/pages/NotFound";

// Routes without Header and Footer
const NO_HEADER_ROUTES = ["/login", "/register", "/teacher-login"];
const NO_FOOTER_ROUTES = ["/login", "/register", "/teacher-login", "/admin", "/teacher"];

function Layout() {
  const [location] = useLocation();

  // Determine if we should show header and footer
  const showHeader = !NO_HEADER_ROUTES.includes(location);
  const showFooter = !NO_FOOTER_ROUTES.includes(location);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {showHeader && <Header />}

      <main style={{ flex: 1 }}>
        <Switch>
          {/* ════════════════════════════════════════
              PUBLIC ROUTES
          ════════════════════════════════════════ */}
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/support" component={Support} />
          <Route path="/help" component={Support} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/teacher-login" component={TeacherLogin} />

          {/* ════════════════════════════════════════
              PROTECTED ROUTES - USER
          ════════════════════════════════════════ */}
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/settings" component={Settings} />
          <ProtectedRoute path="/study-tools" component={StudyTools} />
          <ProtectedRoute path="/practice" component={Practice} />
          <ProtectedRoute path="/listening" component={Listening} />
          <ProtectedRoute path="/reading" component={Reading} />
          <ProtectedRoute path="/jointest" component={Jointest} />
          <ProtectedRoute path="/results" component={Results} />

          {/* ════════════════════════════════════════
              PROTECTED ROUTES - ADMIN/TEACHER
          ════════════════════════════════════════ */}
          <ProtectedRoute path="/admin" component={Admin} />
          <ProtectedRoute path="/teacher" component={TeacherDashboard} />

          {/* ════════════════════════════════════════
              404 NOT FOUND
          ════════════════════════════════════════ */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}