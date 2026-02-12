const pool = require('../db')

// Función para obtener TODAS las tareas
// Normalmente responde a un GET /tasks
const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await pool.query("SELECT * FROM task");
    res.json(allTasks.rows);
  } catch (error) {
    next(error)
  }
};

// Función para obtener UNA sola tarea por id
// Normalmente responde a un GET /tasks/:id
const getTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM task WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Task not found",
      });
    res.json(result.rows[0]);
  } catch (error) {
    next(error)
  }

};

// Función para crear una nueva tarea
// Normalmente responde a un POST /tasks
const createTask = async (req, res, next) => {

  const { title, description } = req.body
  try {
    const result = await pool.query("INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *", [
      title,
      description
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    next(error)
  }
  // req.body tendrá los datos enviados desde el cliente
  res.send('Creating a task');
};

// Función para eliminar una tarea
// Normalmente responde a un DELETE /tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await pool.query('DELETE * FROM task WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Task not found",
      });
    res.json(result.rows[0]);
  } catch (error) {
    next(error)
  }
};

// Función para actualizar una tarea existente
// Normalmente responde a un PUT o PATCH /tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, description } = req.body;
    const result = await pool.query("UPDATE task SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Task not found",
      });
    res.json(result.rows[0]);
  } catch (error) {
    next(error)
  }
};

// Exporta todas las funciones para usarlas en las rutas
module.exports = {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
};
