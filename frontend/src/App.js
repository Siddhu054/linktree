import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/routing/PrivateRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/pages/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Dashboard from "./components/dashboard/Dashboard";
import Links from "./components/links/Links";
import Analytics from "./components/analytics/Analytics";
import Settings from "./components/settings/Settings";
import Appearance from "./components/appearance/Appearance";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Landing />
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/forgot-password"
                element={
                  <>
                    <Navbar />
                    <ForgotPassword />
                  </>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <>
                    <Navbar />
                    <ResetPassword />
                  </>
                }
              />

              {/* Protected routes with DashboardLayout */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/links"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Links />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Analytics />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/appearance"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Appearance />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
            <ToastContainer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
