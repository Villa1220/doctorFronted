// src/components/admin/Sidebar.styles.ts
import { SxProps, Theme } from '@mui/material/styles';

export const sidebarStyles: SxProps<Theme> = (theme) => ({
  width: 280,
  height: '100vh',
  bgcolor: 'background.paper',
  borderRight: 'none',
  background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.primary.light}08)`,
  boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.25s ease-in-out', // transición más rápida
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const listStyles: SxProps<Theme> = {
  py: 2,
  px: 2,
  mt: '80px',
};

export const listItemStyles = ({ isSelected }: { isSelected: boolean }): SxProps<Theme> => (theme) => ({
  borderRadius: 16,
  mb: 1.2,
  px: 2,
  py: 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: isSelected ? `${theme.palette.primary.main}15` : 'transparent',
  border: isSelected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.25s ease-in-out', // más rápido y suave
  cursor: 'pointer',
  textDecoration: 'none',
  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}08`,
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateX(4px) scale(1.02)', // scale más pequeño para no ser exagerado
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
});

export const listItemIconStyles = ({ isSelected }: { isSelected: boolean }): SxProps<Theme> => (theme) => ({
  minWidth: 40,
  color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: 'all 0.25s ease-in-out',
  fontSize: '1.8rem',
});

export const listItemTextStyles = ({ isSelected }: { isSelected: boolean }): SxProps<Theme> => (theme) => ({
  '& .MuiTypography-root': {
    fontWeight: isSelected ? 700 : 500,
    color: isSelected ? theme.palette.text.primary : theme.palette.text.secondary,
    fontSize: '1rem',
    transition: 'all 0.25s ease-in-out',
  },
});

export const logoutListItemStyles: SxProps<Theme> = (theme) => ({
  borderRadius: 16,
  mb: 1.5,
  px: 2,
  py: 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  border: '2px solid transparent',
  transition: 'all 0.25s ease-in-out',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}08`,
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateX(4px) scale(1.02)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiTypography-root': {
      color: theme.palette.primary.main,
    },
  },
});

export const logoutIconStyles: SxProps<Theme> = (theme) => ({
  color: theme.palette.text.secondary,
  transition: 'all 0.25s ease-in-out',
});
