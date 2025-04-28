import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  styled,
} from '@mui/material';
import { Close, LocalHospital } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Interfaces
interface Specialty {
  id: number;
  nombre: string;
  descripcion: string;
}

// Estilos
const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.dark,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    minWidth: 400,
  },
}));

export default function SpecialtiesManagement() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://172.214.214.220:3000/especialidad', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener especialidades');
        }

        const data = await response.json();
        setSpecialties(data);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      }
    };

    fetchSpecialties();
  }, []);

  const handleOpenDialog = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSpecialty(null);
  };

  return (
    <Box p={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <StyledTypography variant="h4" gutterBottom>
        Especialidades Médicas
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Consulta las especialidades disponibles en el sistema.
      </Typography>

      {/* Tarjetas de especialidades */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {specialties.length > 0 ? (
          specialties.map((specialty) => (
            <Grid item xs={12} sm={6} md={4} key={specialty.id}>
              <StyledCard onClick={() => handleOpenDialog(specialty)}>
                <CardHeader
                  title={specialty.nombre}
                  titleTypographyProps={{ align: 'center', fontWeight: 'bold' }}
                  sx={{ backgroundColor: '#f5f5f5', textAlign: 'center', cursor: 'pointer' }}
                />
                <CardContent sx={{ cursor: 'pointer' }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {specialty.descripcion}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ width: '100%', mt: 4 }}>
            No se encontraron especialidades.
          </Typography>
        )}
      </Grid>

      {/* Modal de detalles */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LocalHospital sx={{ color: 'primary.main' }} />
          {selectedSpecialty?.nombre}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            {selectedSpecialty?.descripcion}
          </Typography>
        </DialogContent>
      </StyledDialog>
    </Box>
  );
}
