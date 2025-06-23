const express = require("express");
const { protect } = require("../middlwares/authMiddleware");
const { createTask, updateTask, deleteTask, getTask } = require("../contollers/task.controller.js");

const Router = express.Router();

Router.post("/createTask",  createTask);
Router.put("/updateTask/:taskId",  updateTask);
Router.delete("/deleteTask/:taskId", deleteTask);
Router.get("/getTasks", getTask);

module.exports = Router;