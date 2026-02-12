// Importa Router desde express para definir rutas
const { Router } = require('express');

// Importa las funciones del controller de tareas
// Cada función maneja la lógica de una ruta
const {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
} = require('../controllers/tasks.controllers');

// Crea una nueva instancia del router
const router = Router();

// Ruta para obtener TODAS las tareas
// GET /tasks
// Llama a la función getAllTasks del controller
router.get('/tasks', getAllTasks);

// Ruta para obtener UNA tarea específica
// GET /tasks/10 (ahora está fijo en 10, solo para prueba)
router.get('/tasks/:id', getTask);

// Ruta para crear una nueva tarea
// POST /tasks
// Los datos vienen en req.body
router.post('/tasks', createTask);

// Ruta para eliminar una tarea
router.delete('/tasks/:id', deleteTask);

// Ruta para actualizar una tarea
// PUT /tasks
// Normalmente se pasa el id: /tasks/:id
router.put('/tasks/:id', updateTask);

// Exporta el router para usarlo en app.js o index.js
module.exports = router;
