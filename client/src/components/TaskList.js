// Importamos hooks de React
// useState -> para manejar estado
// useEffect -> para ejecutar código cuando el componente se monta o cambia algo
import { useEffect, useState } from "react"

// Importamos componentes visuales de Material UI
// Button -> botón
// Card -> contenedor visual tipo tarjeta
// CardContent -> contenido interno de la tarjeta
// Typography -> texto con estilos predefinidos
import { Button, Card, CardContent, Typography } from '@mui/material'

// Hook de React Router para navegar entre rutas
import { useNavigate } from "react-router-dom"


// Declaramos y exportamos el componente TaskList
export default function TaskList() {

  // Estado que guarda la lista de tareas
  // Inicialmente es un array vacío
  const [tasks, setTasks] = useState([])

  // Hook para poder redirigir a otra página
  const navigate = useNavigate();


  // Función asíncrona que obtiene todas las tareas del backend
  const loadTasks = async () => {

    // Hacemos petición GET al servidor
    const response = await fetch(`http://localhost:4000/tasks`)

    // Convertimos la respuesta a JSON
    const data = await response.json()

    // Guardamos las tareas en el estado
    setTasks(data)
  }


  // Función para eliminar una tarea por su ID
  const handleDelete = async (id) => {
    try {
      // Enviamos petición DELETE al backend
      await fetch(`http://localhost:4000/tasks/${id}`, {
        method: "DELETE",
      })

      // Actualizamos el estado eliminando la tarea del array
      // filter crea un nuevo array sin la tarea eliminada
      setTasks(tasks.filter(task => task.id !== id))

    } catch (error) {
      console.log(error)
    }
  }


  // useEffect se ejecuta cuando el componente se monta por primera vez
  // El array vacío [] significa "solo una vez"
  useEffect(() => {
    loadTasks()
  }, [])


  // Render del componente
  return (
    <>
      <h1>Task List</h1>

      {/* Recorremos el array de tareas */}
      {tasks.map((task) => (

        // Card representa una tarea individual
        <Card
          style={{
            marginBottom: ".7rem",
            backgroundColor: '#1e272e',
          }}
          key={task.id} // React necesita una key única
        >

          <CardContent
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >

            {/* Contenedor del texto */}
            <div style={{ color: "white" }}>
              <Typography>
                {task.title}
              </Typography>

              <Typography>
                {task.description}
              </Typography>
            </div>


            {/* Contenedor de botones */}
            <div>

              {/* Botón para editar */}
              <Button
                variant="contained"
                color="inherit"

                // Cuando se hace click, navegamos a la ruta de edición
                onClick={() => navigate(`/tasks/${task.id}/edit`)}
              >
                Edit
              </Button>

              {/* Botón para eliminar */}
              <Button
                variant="contained"
                color="warning"

                // Cuando se hace click, ejecuta handleDelete
                onClick={() => handleDelete(task.id)}

                style={{ marginLeft: ".5rem" }}
              >
                Delete
              </Button>

            </div>

          </CardContent>
        </Card>
      ))}
    </>
  )
}
