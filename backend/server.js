import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import hospitalRoutes from "./routes/hospitalRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


/*
==============================
Middleware
==============================
*/

app.use(express.json());


/*
==============================
MongoDB Connection
==============================
*/

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB Connected Successfully");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});


/*
==============================
Routes
Final endpoint:
POST http://localhost:5000/api/hospitals
==============================
*/

app.use("/api/hospitals", hospitalRoutes);


/*
==============================
Health Check Route
==============================
*/

app.get("/", (req, res) => {
  res.send("Hospital Recommendation API is running");
});


/*
==============================
Start Server
==============================
*/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});