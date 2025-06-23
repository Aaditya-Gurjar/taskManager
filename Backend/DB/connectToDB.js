const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("ENtered in db ")
  try {
    console.log("db url : ",process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports = connectDB;
