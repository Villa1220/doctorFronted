import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  styled,
} from '@mui/material';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Interface for doctor data
interface Doctor {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  especialidad: { id: number; nombre: string };
  centroMedico: { id: number; nombre: string };
}


// Sample local doctor data
const localDoctors: Doctor[] = [
  
];

// Styled components for elegant design
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.2s ease-in-out',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.dark,
}));

export default function DoctorsManagement() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchId, setSearchId] = useState('');
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    especialidad_id: '',
    centro_medico_id: '',
    correo: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [especialidades, setEspecialidades] = useState<{ id: number; nombre: string }[]>([]);
  const [centrosMedicos, setCentrosMedicos] = useState<{ id: number; nombre: string }[]>([]);

  // Initialize doctors on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://20.81.216.9:3000/admin/medico', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los médicos');
        }

        const data: Doctor[] = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error al cargar médicos:', error);
      }
    };

    const fetchEspecialidades = async () => {
      try {
        const response = await fetch('http://20.81.216.9:3000/admin/especialidad', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      }
    };

    const fetchCentrosMedicos = async () => {
      try {
        const response = await fetch('http://20.81.216.9:3000/admin/centro-medico', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCentrosMedicos(data);
      } catch (error) {
        console.error('Error al cargar centros médicos:', error);
      }
    };

    fetchDoctors();
    fetchEspecialidades();
    fetchCentrosMedicos();
  }, []);

  // Search doctor by ID
  const handleSearch = () => {
    if (!searchId) {
      setDoctors(localDoctors);
      setPage(0); // Reset to first page on search
      return;
    }
    const filtered = doctors.filter((doctor) => doctor.id === searchId);

    setDoctors(filtered);
    setPage(0); // Reset to first page on search
  };

  // Open add dialog
  const handleOpenAdd = () => {
    setFormData({
      id: '',
      nombre: '',
      apellido: '',
      especialidad_id: '',
      centro_medico_id: '',
      correo:'',
    });
    setOpenAddDialog(true);
  };

  // Add new doctor
  const handleAdd = async () => {
    if (
      !formData.id.trim() ||
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.especialidad_id ||
      !formData.centro_medico_id
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://20.81.216.9:3000/admin/medico-completo', {

        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          nombre: formData.nombre,
          apellido: formData.apellido,
          especialidad_id: parseInt(formData.especialidad_id),
          centro_medico_id: parseInt(formData.centro_medico_id),
          correo: formData.correo
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el médico');
      }

      // Refresca la lista con el nuevo médico
      const newDoctor: Doctor = await response.json();
      setDoctors([...doctors, newDoctor]);
      setOpenAddDialog(false);
      setFormData({
        id: '',
        nombre: '',
        apellido: '',
        especialidad_id: '',
        centro_medico_id: '',
        correo: '',
      });
      setPage(0); // Opcional: resetear la paginación

    } catch (error) {
      console.error('Error al agregar médico:', error);
      alert('Hubo un error al agregar el médico.');
    }
  };


  // Open edit dialog
  const handleEdit = (doctor: Doctor) => {
    setEditDoctor(doctor);
    setFormData({
      id: doctor.id,
      nombre: doctor.nombre,
      apellido: doctor.apellido,
      especialidad_id: doctor.especialidad.id.toString(),
      centro_medico_id: doctor.centroMedico.id.toString(),
      correo:'',
    });
    setOpenEditDialog(true);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edited doctor
  const handleSave = async () => {
    if (!editDoctor) return;
  
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.especialidad_id ||
      !formData.centro_medico_id ||
      !formData.correo.trim()
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      // Paso 1: Actualizar médico
      const response = await fetch(
        `http://20.81.216.9:3000/admin/medico/${formData.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido: formData.apellido,
            especialidad_id: parseInt(formData.especialidad_id),
            centro_medico_id: parseInt(formData.centro_medico_id),
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Error al actualizar el médico');
      }
  
      const updatedDoctor: Doctor = await response.json();
  
      // Paso 2: Actualizar correo del usuario
      const userUpdateResponse = await fetch(
        `http://20.81.216.9:3000/admin/usuario/medico/${formData.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo: formData.correo,
          }),
        }
      );
  
      if (!userUpdateResponse.ok) {
        throw new Error('Error al actualizar el usuario');
      }
  
      // Paso 3: Refrescar datos locales
      const updatedDoctors = doctors.map((doc) =>
        doc.id === editDoctor.id ? updatedDoctor : doc
      );
  
      setDoctors(updatedDoctors);
      setOpenEditDialog(false);
      setEditDoctor(null);
      setPage(0);
    } catch (error) {
      console.error('Error al guardar médico o usuario:', error);
    }
  };
  
  

  // Open delete confirmation dialog
  const handleDelete = (id: string) => {
    setDoctorToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!doctorToDelete) return;
  
    try {
      const token = localStorage.getItem('token');
  
      // 1. Eliminar médico
      const resMedico = await fetch(`http://20.81.216.9:3000/admin/medico/${doctorToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!resMedico.ok) throw new Error('Error al eliminar médico');
  
      // 2. Eliminar usuario
      const resUsuario = await fetch(`http://20.81.216.9:3000/auth/users/${doctorToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!resUsuario.ok) {
        console.warn('Usuario no eliminado (puede no existir)');
      }
  
      // actualizar UI
      const updatedDoctors = doctors.filter((doc) => doc.id !== doctorToDelete);
      setDoctors(updatedDoctors);
      setOpenDeleteDialog(false);
      setDoctorToDelete(null);
      setPage(0);
    } catch (error) {
      console.error('Error al eliminar médico:', error);
      alert('Hubo un error al eliminar el médico.');
    }
  };
  

  // Handle pagination
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  // Calculate paginated data
  const paginatedDoctors = doctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <StyledTypography variant="h4" gutterBottom>
        Gestión de Médicos
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Administra los médicos del sistema con facilidad.
      </Typography>

      {/* Search Bar */}
      <Box display="flex" gap={2} mb={4} alignItems="center">
        <TextField
          label="Buscar por ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1, maxWidth: '400px' }}
        />
        <StyledButton variant="contained" color="primary" onClick={handleSearch}>
          Buscar
        </StyledButton>
        <StyledButton
          variant="outlined"
          color="secondary"
          onClick={() => {
            // vuelve a cargar desde el backend
            setSearchId('');
            window.location.reload(); // opción simple para recargar toda la tabla

            setPage(0); // Reset pagination on clear
          }}
        >
          Limpiar
        </StyledButton>
        <StyledButton variant="contained" color="success" onClick={handleOpenAdd}>
          <Add /> Nuevo Médico
        </StyledButton>
      </Box>

      {/* Doctors Table */}
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Apellido</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Correo</TableCell>

                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Especialidad
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Centro Médico
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDoctors.length > 0 ? (
                paginatedDoctors.map((doctor) => (
                  <StyledTableRow key={doctor.id}>
                    <TableCell>{doctor.id}</TableCell>
                    <TableCell>{doctor.nombre}</TableCell>
                    <TableCell>{doctor.apellido}</TableCell>
                    <TableCell>{doctor.correo}</TableCell>

                    <TableCell>{doctor.especialidad.nombre}</TableCell>
                    <TableCell>{doctor.centroMedico.nombre}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(doctor)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(doctor.id)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron médicos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={doctors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />

      {/* Add Dialog */}
      <StyledDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}
        disableEnforceFocus={false}>

        <DialogTitle>Nuevo Médico</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>ID Especialidad</InputLabel>
            <Select
              name="especialidad_id"
              value={formData.especialidad_id}
              onChange={(e) =>
                setFormData({ ...formData, especialidad_id: e.target.value })
              }
              label="ID Especialidad"
            >
              {especialidades.map((esp) => (
                <MenuItem key={esp.id} value={esp.id}>
                  {esp.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>ID Centro Médico</InputLabel>
            <Select
              name="centro_medico_id"
              value={formData.centro_medico_id}
              onChange={(e) =>
                setFormData({ ...formData, centro_medico_id: e.target.value })
              }
              label="ID Centro Médico"
            >
              {centrosMedicos.map((cm) => (
                <MenuItem key={cm.id} value={cm.id}>
                  {cm.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenAddDialog(false)} color="secondary">
            Cancelar
          </StyledButton>
          <StyledButton onClick={handleAdd} variant="contained" color="primary">
            Guardar
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Edit Dialog */}
      <StyledDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Médico</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>ID Especialidad</InputLabel>
            <Select
              name="especialidad_id"
              value={formData.especialidad_id}
              onChange={(e) =>
                setFormData({ ...formData, especialidad_id: e.target.value })
              }
              label="ID Especialidad"
            >
              {especialidades.map((esp) => (
                <MenuItem key={esp.id} value={esp.id}>
                  {esp.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>ID Centro Médico</InputLabel>
            <Select
              name="centro_medico_id"
              value={formData.centro_medico_id}
              onChange={(e) =>
                setFormData({ ...formData, centro_medico_id: e.target.value })
              }
              label="ID Centro Médico"
            >
              {centrosMedicos.map((cm) => (
                <MenuItem key={cm.id} value={cm.id}>
                  {cm.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancelar
          </StyledButton>
          <StyledButton onClick={handleSave} variant="contained" color="primary">
            Guardar
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Delete Confirmation Dialog */}
      <StyledDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este médico?</Typography>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancelar
          </StyledButton>
          <StyledButton onClick={confirmDelete} variant="contained" color="error">
            Eliminar
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
}
