import {
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
  } from "@mui/material";
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { StyledDialog, StyledButton } from "./AppointmentsManagement.styles";
  import { useAuth } from "../../contexts/AuthContext"; // 💥 Importamos useAuth
  
  interface EditDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    formData: {
      paciente_nombre: string;
      paciente_apellido: string;
      motivo: string;
      medico_id: string;
      fecha: string;
    };
    onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    dateValue: Date | null;
    setDateValue: (date: Date | null) => void;
  }
  
  export default function EditDialog({
    open,
    onClose,
    onSave,
    formData,
    onFormChange,
    dateValue,
    setDateValue,
  }: EditDialogProps) {
    const { user } = useAuth(); // 💥 Obtenemos el usuario logueado
  
    return (
      <StyledDialog open={open} onClose={onClose}>
        <DialogTitle>Editar Consulta</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Nombre del Paciente"
            name="paciente_nombre"
            value={formData.paciente_nombre}
            onChange={onFormChange}
            fullWidth
          />
          <TextField
            label="Apellido del Paciente"
            name="paciente_apellido"
            value={formData.paciente_apellido}
            onChange={onFormChange}
            fullWidth
          />
          <DateTimePicker
            label="Fecha y Hora"
            value={dateValue}
            onChange={setDateValue}
            minDateTime={new Date()} // 🔥 Evitar fechas pasadas
            slots={{ textField: TextField }}
            slotProps={{ textField: { fullWidth: true } }}
            enableAccessibleFieldDOMStructure={false}
          />
          <TextField
            label="Motivo de Consulta"
            name="motivo"
            value={formData.motivo}
            onChange={onFormChange}
            fullWidth
          />
          <TextField
            label="ID del Médico"
            name="medico_id"
            value={formData.medico_id}
            onChange={onFormChange}
            fullWidth
            disabled={user?.role === "doctor"} // 🔥 Si es doctor, deshabilitado
          />
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={onClose} color="secondary">
            Cancelar
          </StyledButton>
          <StyledButton onClick={onSave} variant="contained" color="primary">
            Guardar Cambios
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    );
  }
  