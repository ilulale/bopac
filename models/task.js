const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({}, { strict: false });

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
