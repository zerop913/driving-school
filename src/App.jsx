import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DrivingSchools from "./pages/DrivingSchools";
import Staff from "./pages/Staff";
import Courses from "./pages/Courses";
import Groups from "./pages/Groups";
import Students from "./pages/Students";
import Inspectors from "./pages/Inspectors";
import ExamRoutes from "./pages/ExamRoutes";
import Register from "./pages/Register";
import UserManagement from "./pages/UserManagement";
import { getRole } from "./services/auth";

const ProtectedRoute = ({ children, roles }) => {
  const role = getRole();
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driving-schools"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student", "guest"]}>
              <DrivingSchools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student", "guest"]}>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute roles={["admin", "teacher"]}>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute roles={["admin", "teacher"]}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspectors"
          element={
            <ProtectedRoute roles={["admin", "teacher"]}>
              <Inspectors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-routes"
          element={
            <ProtectedRoute roles={["admin", "teacher", "inspector"]}>
              <ExamRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute roles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
