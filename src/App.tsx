import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

const RootLayoutController = () => {
  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    if (location.pathname === "/") {
      root.classList.remove("center-layout");
    } else {
      root.classList.add("center-layout");
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <>
        <RootLayoutController />
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
