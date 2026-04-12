// src/App.jsx
import { Switch, Route, useLocation } from "wouter";
import { AuthProvider } from "@/features/auth/authStore";
import { useEffect } from "react";

// Layout
import Header from "@/components/layout/Header";

// ── Pages (существующие) ──
import Home             from "@/pages/Home";
import About            from "@/pages/About";
import Login            from "@/pages/Login";
import Register         from "@/pages/Register";
import Profile          from "@/pages/Profile";
import PlacementTest    from "@/pages/PlacementTest";
import Practice         from "@/pages/Practice";
import StudyTools       from "@/pages/StudyTools";
import Listening        from "@/pages/Listening";
import Reading          from "@/pages/Reading";
import Writing          from "@/pages/Writing";
import Admin            from "@/pages/Admin";
import Results          from "@/pages/Result";
import Jointest         from "@/pages/Jointest";
import TeacherDashboard from "@/pages/TeacherDashboard";
import TeacherLogin     from "@/pages/Teacher-login";
import NotFound         from "@/pages/NotFound";

// ── Страницы в разработке — заглушки ──
import Speaking         from "@/pages/Speaking";
import Dashboard        from "@/pages/Dashboard";
import Settings         from "@/pages/Settings";
import Support          from "@/pages/Support";

// ── Routes ──
const NO_HEADER_ROUTES = ["/login", "/register", "/teacher-login"];
const NO_FOOTER_ROUTES = ["/login", "/register", "/teacher-login", "/admin", "/teacher"];

function Layout() {
  const [location] = useLocation();

  const showHeader = !NO_HEADER_ROUTES.includes(location);
  const showFooter = !NO_FOOTER_ROUTES.includes(location);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {showHeader && <Header />}

      <main style={{ flex: 1 }}>
        <Switch>
          {/* ── Public ── */}
          <Route path="/"              component={Home} />
          <Route path="/about"         component={About} />
          <Route path="/login"         component={Login} />
          <Route path="/register"      component={Register} />
          <Route path="/teacher-login" component={TeacherLogin} />
          <Route path="/support"       component={Support} />
          <Route path="/help"          component={Support} />
          <Route path="/placement"     component={PlacementTest} />

          {/* ── Student ── */}
          <Route path="/dashboard"     component={Dashboard} />
          <Route path="/profile"       component={Profile} />
          <Route path="/settings"      component={Settings} />
          <Route path="/practice"      component={Practice} />
          <Route path="/tools"         component={StudyTools} />
          <Route path="/study-tools"   component={StudyTools} />
          <Route path="/listening"     component={Listening} />
          <Route path="/reading"       component={Reading} />
          <Route path="/writing"       component={Writing} />
          <Route path="/speaking"      component={Speaking} />
          <Route path="/jointest"      component={Jointest} />
          <Route path="/results"       component={Results} />

          {/* ── Admin / Teacher ── */}
          <Route path="/admin"         component={Admin} />
          <Route path="/teacher"       component={TeacherDashboard} />

          {/* ── 404 ── */}
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

// Footer
function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "20px 24px",
      background: "var(--bg2)",
      borderTop: "1px solid var(--border)",
      color: "var(--text3)",
      fontSize: "0.82rem",
    }}>
      © {new Date().getFullYear()} Oxbridge English Academy — All Rights Reserved
    </footer>
  );
}