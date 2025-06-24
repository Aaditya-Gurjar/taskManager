const express = require("express")
const dotenv = require("dotenv");   
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/task.routes.js");
const connectDB = require("./DB/connectToDB.js");
const { protect } = require("./middlwares/authMiddleware.js");
const cors = require('cors')
dotenv.config()

const app = express()
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cookieParser());

connectDB();
app.use(cors({
  origin: "http://localhost:5173", // ✅ allow frontend origin
  credentials: true,               // ✅ allow cookies/authorization headers
}));

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/task', protect, taskRoutes)

app.get('/', (req, res) => {
    return res.send("Server Started!")
})

app.listen(port , () => {
    console.log("Server is Listening! at PORT", port)
})
