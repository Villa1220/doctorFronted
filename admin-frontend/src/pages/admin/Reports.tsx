import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  styled,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PieChart, BarChart } from '@mui/x-charts';
import { useAuth } from '../../contexts/AuthContext';

// Interfaces
interface Consulta {
  id: number;
  paciente: string;
  motivo: string;
  fecha: string;
  doctor: string;
  cedula: string;
}

interface MotivoConsulta {
  motivo: string;
  porcentaje_consultas: number;
}

interface MedicoConsulta {
  doctor: string;
  total_consultas: number;
}

// Estilos personalizados
const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[8],
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(2),
}));

export default function Reports() {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [motivos, setMotivos] = useState<MotivoConsulta[]>([]);
  const [medicos, setMedicos] = useState<MedicoConsulta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [
        consultasResponse,
        motivosResponse,
        medicosResponse,
      ] = await Promise.all([
        fetch('http://20.81.216.9:3000/reportes/reporte-consultas', { headers }),
        fetch('http://20.81.216.9:3000/reportes/porcentaje-motivos', { headers }),
        fetch('http://20.81.216.9:3000/reportes/porcentaje-medicos', { headers }),
      ]);

      const consultasData = await consultasResponse.json();
      const motivosData = await motivosResponse.json();
      const medicosData = await medicosResponse.json();

      const consultasConId = consultasData.map((item: any, idx: number) => ({
        ...item,
        id: idx,
      }));

      setConsultas(consultasConId);
      setMotivos(motivosData);
      setMedicos(medicosData);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const columns: GridColDef[] = [
    { field: 'paciente', headerName: 'Paciente', width: 200 },
    { field: 'motivo', headerName: 'Motivo', width: 200 },
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'doctor', headerName: 'Doctor', width: 200 },
    { field: 'cedula', headerName: 'Cédula', width: 150 },
  ];

  return (
    <Box p={4} sx={{ maxWidth: '1400px', margin: '0 auto' }}>
      <StyledTypography variant="h3" gutterBottom>
        📈 Reportes del Sistema
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Aquí puedes visualizar estadísticas de consultas médicas.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={4} mt={2}>
          {/* Consultas médicas */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                📝 Consultas Médicas
              </Typography>
              <div style={{ height: 450, width: '100%' }}>
                <DataGrid 
                  rows={consultas} 
                  columns={columns} 
                  getRowId={(row) => row.id} 
                  sx={{
                    borderRadius: 3,
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    },
                    fontSize: '1rem',
                  }}
                />
              </div>
            </StyledPaper>
          </Grid>

          {/* Gráficos */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                🥧 Distribución por Motivo
              </Typography>
              <ChartContainer>
                <PieChart
                  series={[
                    {
                      data: motivos.map((item) => ({
                        id: item.motivo,
                        value: item.porcentaje_consultas,
                        label: item.motivo,
                      })),
                    },
                  ]}
                  width={400}
                  height={300}
                />
              </ChartContainer>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                👨‍⚕️ Consultas por Médico
              </Typography>
              <ChartContainer>
                <BarChart
                  xAxis={[
                    {
                      id: 'medicos',
                      data: medicos.map((item) => item.doctor),
                      scaleType: 'band',
                    },
                  ]}
                  series={[
                    {
                      data: medicos.map((item) => item.total_consultas),
                    },
                  ]}
                  width={400}
                  height={300}
                />
              </ChartContainer>
            </StyledPaper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
