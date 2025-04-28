import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/admin/Sidebar';
import Navbar from '../components/admin/Navbar';
import { Box } from '@mui/material';

const roleBasedRoutes: { [key: string]: string[] } = {
  admin: [
    '/admin',
    '/admin/employees',
    '/admin/specialties',
    '/admin/appointments',
    '/admin/medical-centers',
    '/admin/doctors',
    '/admin/reports',
  ],
  doctor: [
    '/admin/appointments',
    '/admin/specialties',
    '/admin/medical-centers',
    '/admin/reports',
  ],
};

export default function AdminLayout() {
  const { user } = useAuth(); // 🔥 Eliminado isLoading
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoutes = roleBasedRoutes[user.role] || [];
  const currentPath = location.pathname;

  if (!allowedRoutes.includes(currentPath)) {
    return <Navigate to={allowedRoutes[0] || '/login'} replace />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '25px',
          width: 'calc(100% - 280px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
