const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
//abrir conexion a postgres
const config = {
  user: "edwindbm3_user",
  database: "edwindbm3",
  password: "sLdr4n8tI1BNIKVKWVD4xmulHqAKGIFH",
  host: "dpg-cf0deukgqg45vesiea80-a.oregon-postgres.render.com",
  port: 5432,
  ssl: true
}
//generamos un cliente de la db
const cliente = new pg.Pool(config);


// Modelo
class TodoModel {
  constructor() {
    this.todos = [];
  }

  async getTodos(){
    const res = await cliente.query("select * from todos");
    console.log(res);
    return res.rows;
  }

  async addTodo(todoText) { 
    //const query = "INSERT INTO todos(task) VALUES($1) RETURNING";
    const query = "INSERT INTO todos (task) VALUES ($1)";
    const values = [todoText]
    const res = await cliente.query(query, values)
    return res;

  }

  editTodo(index, todoText) {
    this.todos[index].text = todoText;
  }

  deleteTodo(index) {
    this.todos.splice(index, 1);
  }

  toggleTodo(index) {
    this.todos[index].completed = !this.todos[index].completed;
  }
}

// Controlador
class TodoController {
  constructor(model) {
    this.model = model;
  }

  async getTodos() {
    return await this.model.getTodos();
  }

  async addTodo(todoText) {
    await this.model.addTodo(todoText);
  }

  editTodo(index, todoText) {
    this.model.editTodo(index, todoText);
  }

  deleteTodo(index) {
    this.model.deleteTodo(index);
  }

  toggleTodo(index) {
    this.model.toggleTodo(index);
  }
}

// Vistas (Rutas)
const app = express();
const todoModel = new TodoModel();
const todoController = new TodoController(todoModel);

app.use(bodyParser.json());

app.get("/todos", async (req, res) => {
  //console.log(await todoController.getTodos());
  const response = await todoController.getTodos()
  res.json(response)
});

// Vistas (Rutas) (continuación)

app.post("/todos", (req, res) => {
  const todoText = req.body.text;
  console.log(req.body)
  todoController.addTodo(todoText);
  res.sendStatus(200);
});

app.put("/todos/:index", (req, res) => {
  const index = req.params.index;
  const todoText = req.body.text;
  todoController.editTodo(index, todoText);
  res.sendStatus(200);
});

app.delete("/todos/:index", (req, res) => {
  const index = req.params.index;
  todoController.deleteTodo(index);
  res.sendStatus(200);
});

app.patch("/todos/:index", (req, res) => {
  const index = req.params.index;
  todoController.toggleTodo(index);
  res.sendStatus(200);
});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
