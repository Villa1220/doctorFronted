import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  TablePagination,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parseISO } from "date-fns"; // ✅ CORREGIDO
import { useAuth } from "../../contexts/AuthContext";
import { Snackbar, Alert } from "@mui/material";

// Estilos
import {
  StyledTableContainer,
  StyledTableRow,
  StyledButton,
  StyledTypography,
} from "./AppointmentsManagement.styles";

// Componentes Dialogs
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";

// Interfaces
interface Appointment {
  id: number;
  paciente_nombre: string;
  paciente_apellido: string;
  fecha: string;
  motivo: string;
  medico_id: string;
}

export default function AppointmentsManagement() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchId, setSearchId] = useState("");
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(
    null
  );
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    paciente_nombre: "",
    paciente_apellido: "",
    fecha: "",
    motivo: "",
    medico_id: "",
  });
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://20.81.216.9:3000/consulta", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener consultas");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error al cargar consultas:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSearch = () => {
    if (!searchId) {
      fetchAppointments();
      setPage(0);
      return;
    }
    const filtered = appointments.filter(
      (appointment) => appointment.id.toString() === searchId
    );
    setAppointments(filtered);
    setPage(0);
  };

  const handleOpenAdd = () => {
    setFormData({
      paciente_nombre: "",
      paciente_apellido: "",
      fecha: "",
      motivo: "",
      medico_id: user?.role === "doctor" ? user.medico_id ?? "" : "", // 🔥 Aquí se llena automático
    });
    setDateValue(new Date());
    setOpenAddDialog(true);
  };

  const handleAdd = async () => {
    if (
      !formData.paciente_nombre.trim() ||
      !formData.paciente_apellido.trim() ||
      !dateValue ||
      !formData.motivo.trim() ||
      !formData.medico_id.trim()
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const formattedDate = dateValue.toISOString();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://20.81.216.9:3000/consulta", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          fecha: formattedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar consulta");
      }

      fetchAppointments();
      setOpenAddDialog(false);
      setSuccessMessage("Consulta agregada exitosamente");
      setSuccessSnackbarOpen(true);
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error al agregar consulta:", error);
      alert("Error al agregar consulta");
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditAppointment(appointment);
    const parsedDate = parseISO(appointment.fecha); // ✅ CORREGIDO
    setDateValue(parsedDate);
    setFormData({
      paciente_nombre: appointment.paciente_nombre,
      paciente_apellido: appointment.paciente_apellido,
      fecha: appointment.fecha,
      motivo: appointment.motivo,
      medico_id: appointment.medico_id,
    });
    setOpenEditDialog(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editAppointment) return;
    if (
      !formData.paciente_nombre.trim() ||
      !formData.paciente_apellido.trim() ||
      !dateValue ||
      !formData.motivo.trim() ||
      !formData.medico_id.trim()
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const formattedDate = dateValue.toISOString();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://20.81.216.9:3000/consulta/${editAppointment.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            fecha: formattedDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar consulta");
      }

      fetchAppointments();
      setOpenEditDialog(false);
      setSuccessMessage("Consulta actualizada exitosamente");
      setSuccessSnackbarOpen(true);
    } catch (error) {
      console.error("Error al actualizar consulta:", error);
      alert("Error al actualizar consulta");
    }
  };

  const handleDelete = (id: number) => {
    setAppointmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (appointmentToDelete === null) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://20.81.216.9:3000/consulta/${appointmentToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar consulta");
      }

      fetchAppointments();
      setOpenDeleteDialog(false);
      setAppointmentToDelete(null);

      // 🔥 Mostrar mensaje de éxito
      setSuccessMessage("Consulta eliminada exitosamente");
      setSuccessSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar consulta:", error);
      alert("Error al eliminar consulta");
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAppointments = appointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={4} sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <StyledTypography variant="h4" gutterBottom>
          Gestión de Consultas
        </StyledTypography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Bienvenido, {user?.name}. Administra las consultas médicas del sistema
          con facilidad.
        </Typography>

        {/* Barra de búsqueda */}
        <Box display="flex" gap={2} mb={4} alignItems="center">
          <TextField
            label="Buscar por ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flex: 1, maxWidth: "400px" }}
          />
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Buscar
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="secondary"
            onClick={() => {
              setSearchId("");
              fetchAppointments();
              setPage(0);
            }}
          >
            Limpiar
          </StyledButton>
          <StyledButton
            variant="contained"
            color="success"
            onClick={handleOpenAdd}
          >
            <Add /> Nueva Consulta
          </StyledButton>
        </Box>

        {/* Tabla de consultas */}
        <Paper>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre Paciente</TableCell>
                  <TableCell>Apellido Paciente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>ID Médico</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((appointment) => (
                    <StyledTableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.paciente_nombre}</TableCell>
                      <TableCell>{appointment.paciente_apellido}</TableCell>
                      <TableCell>{appointment.fecha}</TableCell>
                      <TableCell>{appointment.motivo}</TableCell>
                      <TableCell>{appointment.medico_id}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(appointment)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No se encontraron consultas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => handleChangePage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
        />

        {/* Diálogos */}
        <AddDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAdd={handleAdd}
          formData={formData}
          onFormChange={handleFormChange}
          dateValue={dateValue}
          setDateValue={setDateValue}
          user={user} // 👈 Nuevo
        />

        <EditDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSave={handleSave}
          formData={formData}
          onFormChange={handleFormChange}
          dateValue={dateValue}
          setDateValue={setDateValue}
        />

        {/* Confirmar eliminación */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>¿Eliminar Consulta?</DialogTitle>
          <DialogContent>
            ¿Estás seguro de que deseas eliminar esta consulta?
          </DialogContent>
          <DialogActions>
            <StyledButton
              onClick={() => setOpenDeleteDialog(false)}
              color="secondary"
            >
              Cancelar
            </StyledButton>
            <StyledButton
              onClick={confirmDelete}
              color="error"
              variant="contained"
            >
              Eliminar
            </StyledButton>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSuccessSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
