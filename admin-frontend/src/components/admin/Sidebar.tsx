// src/components/admin/Sidebar.tsx
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  MedicalServices as SpecialtiesIcon,
  EventNote as AppointmentsIcon,
  Assessment as ReportsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
  sidebarStyles,
  listStyles,
  listItemStyles,
  listItemIconStyles,
  listItemTextStyles,
} from './Sidebar.styles';

const menuItems = [
  { path: '/admin/appointments', icon: <AppointmentsIcon />, text: 'Gestionar Consultas', roles: ['admin', 'doctor'] },
  { path: '/admin/specialties', icon: <SpecialtiesIcon />, text: 'Especialidades', roles: ['admin', 'doctor'] },
  { path: '/admin/reports', icon: <ReportsIcon />, text: 'Reportes', roles: ['admin', 'doctor'] },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const visibleMenuItems = menuItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <List sx={sidebarStyles}>
      <Box sx={listStyles}>
        {/* Opciones del menú */}
        {visibleMenuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem
              component={Link}
              to={item.path}
              key={item.path}
              sx={listItemStyles({ isSelected })}
            >
              <ListItemIcon sx={listItemIconStyles({ isSelected })}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={listItemTextStyles({ isSelected })} />
            </ListItem>
          );
        })}

        {/* Cerrar Sesión con mismo estilo */}
        <ListItem
          component="button"
          onClick={logout}
          sx={listItemStyles({ isSelected: false })}
        >
          <ListItemIcon sx={listItemIconStyles({ isSelected: false })}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" sx={listItemTextStyles({ isSelected: false })} />
        </ListItem>
      </Box>
    </List>
  );
}
