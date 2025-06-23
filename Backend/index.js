const express = require("express")
const dotenv = require("dotenv");   
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/task.routes.js");
const connectDB = require("./DB/connectToDB.js");
const { protect } = require("./middlwares/authMiddleware.js");
dotenv.config()

const app = express()
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cookieParser());

connectDB();


app.use('/api/v1/user', protect, userRoutes)
app.use('/api/v1/task', protect, taskRoutes)

app.get('/', (req, res) => {
    return res.send("Server Started!")
})

app.listen(port , () => {
    console.log("Server is Listening! at PORT", port)
})
