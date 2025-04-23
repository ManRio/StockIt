import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import PerfilUsuario from './pages/PerfilUsuario';

// COMPONENTES UNIFICADOS Y REFACTORIZADOS
import Dashboard from './pages/Dashboard';
import FormularioVenta from './pages/FormularioVenta';
import HistorialVentas from './pages/HistorialVentas';
import ReporteMensual from './pages/ReporteMensual';

// COMPONENTES ADMIN
import UserManagement from './pages/UserManagement';
import ProductoGestion from './pages/ProductoGestion';
import Landing from './pages/Landing';

function App() {
  console.log('App cargado');
  return (
    <Router>
      <Routes>
        {/* Pública */}
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Landing />} />

        {/* Dashboard */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Gestión usuarios (solo admin) */}
        <Route
          path='/admin/usuarios'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Gestión productos (solo admin) */}
        <Route
          path='/admin/productos'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MainLayout>
                <ProductoGestion />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Registrar nueva venta (admin y empleado) */}
        <Route
          path='/ventas/nueva'
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
              <MainLayout>
                <FormularioVenta />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Historial de ventas (admin ve todo, empleado ve solo suyas) */}
        <Route
          path='/ventas/historial'
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
              <MainLayout>
                <HistorialVentas />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Reporte mensual (solo admin) */}
        <Route
          path='/ventas/reporte'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MainLayout>
                <ReporteMensual />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Perfil-Usuario */}
        <Route
          path='/perfil'
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
              <MainLayout>
                <PerfilUsuario />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;
