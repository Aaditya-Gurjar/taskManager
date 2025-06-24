const taskModel = require("../model/task.model");

const createTask = async (req, res) => {
    console.log("Creating task...");
    try {
        const { title, description, completed } = req.body;
        const userId = req.user; // Assuming user ID is set in the request by auth middleware
        // Check for required fields
        if (!title || !description) {
            return res.status(400).json({ status : false,  message: "Title and description are required" });
        }
        // Create new task
        const newTask = await taskModel.create({
            title: title,
            description: description,
            completed: completed || false,
            user: userId
        });
        res.status(201).json({
            status : true,
            message: "Task created successfully",
            task: {
                id: newTask._id,
                title: newTask.title,
                description: newTask.description,
                completed: newTask.completed,
                user: newTask.user
            }
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params; // Assuming task ID is passed in the URL
        const { title, description, completed } = req.body;
        const userId = req.user; // Assuming user ID is set in the request by auth middleware

        // Check if task exists
        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if the user is authorized to update this task
        if (task.user.toString() !== userId) {
            return res.status(403).json({ status:false,  message: "Not authorized to update this task" });
        }

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;

        // Save updated task
        const updatedTask = await task.save();

        res.status(200).json({
            status : true,
            message: "Task updated successfully",
            task: {
                id: updatedTask._id,
                title: updatedTask.title,
                description: updatedTask.description,
                completed: updatedTask.completed,
                user: updatedTask.user
            }
        });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const userId = req.user; // Assuming user ID is set in the request by auth middleware
        // Check if task exists
        const task = await taskModel.findById(taskId)
        if (!task) {
            return res.status(400).json({
                status: false,
                message: "No task found!"
            })
        }
        if (!task.user.toString() === userId)
            return res.status(400).json({
                status: false,
                message: "Not Authorized user!"
            })

        await taskModel.deleteOne({ _id: taskId });
        return res.status(200).json({
            status: true,
            message: "Task Deleted Successfully!"
        })
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({status:false, message: "Internal server error" });
    }
}
const getTask = async (req, res) => {
    try {
        const {page, pageSize} = req.body;
        console.log("page", page, "pageSize", pageSize)
        const skip = page * pageSize;
        


        const userId = req.user; // Assuming user ID is set in the request by auth middleware
        // Fetch tasks for the user
        const tasks = await taskModel.find({ user: userId }).skip(skip).limit(pageSize);
        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: tasks.map(task => ({
                id: task._id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                user: task.user
            }))
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask
}