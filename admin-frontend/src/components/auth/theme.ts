import { createTheme } from '@mui/material/styles';

export const hospitalTheme = createTheme({
  palette: {
    primary: {
      main: '#0B3D91',    // Azul médico elegante
      light: '#5C7AEA',   // Azul claro
      dark: '#072F6B',    // Azul profundo
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4CAF50',     // Verde médico
    },
    background: {
      default: '#f0f2f5',  // Fondo general muy claro
      paper: '#ffffff',    // Fondo de tarjetas
    },
    text: {
      primary: '#2d3748',  // Texto fuerte
      secondary: '#4a5568', // Texto suave
    },
    error: {
      main: '#dc3545',     // Error color (igual)
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    h5: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 12,  // Bordes suaves en general
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          borderRadius: 16,  // Más redondeado para el botón
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#cbd5e0',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: '#5C7AEA',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0B3D91',
              borderWidth: '2px',
            },
          },
          '& input': {
            color: '#2d3748',
            fontSize: '0.95rem',
          },
          '& .MuiInputLabel-root': {
            color: '#4a5568',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#0B3D91',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
        },
      },
    },
  },
});
