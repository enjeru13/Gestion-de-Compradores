import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "../components/PrivateRoute";
import MainLayout from "../components/layout/MainLayout"
import VendedoresTablePage from "../pages/VendedoresTablePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Protegidas dentro del MainLayout */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/ventas" element={<VendedoresTablePage />} />
      </Route>

      {/* Ruta para manejar páginas no encontradas */}
      <Route path="*" element={<Navigate to="/ventas" replace />} />
    </Routes>
  );
};

export default AppRoutes;
