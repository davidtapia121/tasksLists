// Importamos componentes de Material UI para la interfaz visual
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from '@mui/material'

// Importamos hooks de React
import { useState, useEffect } from 'react';

// Importamos hooks de React Router para navegación y parámetros dinámicos
import { useNavigate, useParams } from 'react-router-dom'

// Declaramos y exportamos el componente principal
export default function TaskForm() {

  // Estado para guardar los datos del formulario
  // Inicialmente title y description están vacíos
  const [task, setTask] = useState({
    title: "",
    description: "",
  })

  // Estado para mostrar el spinner mientras se hace una petición
  const [loading, setLoading] = useState(false)

  // Estado para saber si estamos creando o editando
  const [editing, setEditing] = useState(false)

  // Hook para redireccionar a otra ruta
  const navigate = useNavigate();

  // Hook para obtener parámetros dinámicos de la URL (ej: /tasks/:id)
  const params = useParams();


  // Función que se ejecuta cuando se envía el formulario
  const handleSubmit = async e => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);   // Activa el spinner

    // Si estamos editando una tarea existente
    if (editing) {
      await fetch(`http://localhost:4000/tasks/${params.id}`, {
        method: "PUT", // Actualiza la tarea
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task), // Enviamos los datos actualizados
      })
    } else {
      // Si estamos creando una nueva tarea
      const res = await fetch(`http://localhost:4000/tasks`, {
        method: 'POST',
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });

      await res.json(); // Esperamos respuesta del servidor
    }

    setLoading(false) // Desactivamos spinner
    navigate('/')     // Redirigimos al listado de tareas
  }


  // Maneja los cambios en los inputs del formulario
  // Actualiza el estado dinámicamente según el name del input
  const handleChange = e =>
    setTask({ ...task, [e.target.name]: e.target.value })


  // useEffect se ejecuta cuando el componente se monta
  // o cuando cambia params.id
  useEffect(() => {

    // Función para cargar una tarea existente desde el backend
    const loadTask = async () => {
      setLoading(true) // Activamos spinner mientras carga

      const res = await fetch(`http://localhost:4000/tasks/${params.id}`)
      const data = await res.json()

      // Colocamos los datos obtenidos en el formulario
      setTask({
        title: data.title,
        description: data.description
      })

      setEditing(true)  // Indicamos que estamos editando
      setLoading(false) // Desactivamos spinner
    }

    // Solo se ejecuta si existe un id en la URL
    if (params.id) {
      loadTask()
    }

  }, [params.id]) // Dependencia: se ejecuta si cambia el id


  // Render del componente
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={3}>
        <Card
          sx={{ mt: 5 }}
          style={{
            backgroundColor: '#1e272e',
            padding: '1rem'
          }}
        >

          {/* Título dinámico dependiendo si estamos editando o creando */}
          <Typography
            variant='h5'
            textAlign='center'
            color='white'
          >
            {editing ? "Edit Task" : "Create Task"}
          </Typography>

          <CardContent>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>

              {/* Input del título */}
              <TextField
                variant="filled"
                label="Write your title"
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name="title" // importante para handleChange
                value={task.title}
                onChange={handleChange}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />

              {/* Input de la descripción */}
              <TextField
                variant="filled"
                label="Write your description"
                multiline
                rows={4}
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name="description"
                value={task.description}
                onChange={handleChange}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />

              {/* Botón de guardar */}
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={!task.title || !task.description}
              // Se desactiva si los campos están vacíos
              >
                {loading ? (
                  // Si está cargando, mostramos spinner
                  <CircularProgress color='inherit' size={24} />
                ) : (
                  "Save"
                )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
