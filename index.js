import express from "express";
import bodyParser from "body-parser";
import dotenvConfigOptions from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import todoCategoryRoute from "./routes/todoCategoryRoute.js";

// Configuring Express App
const app = express();

// Setting Middleware to accept JSON type object(s)
app.use(bodyParser.json());

// API routes
app.use("/user", userRoutes);
app.use("/todo", todoRoutes);
app.use("/category", todoCategoryRoute);

// Running the server using environment variables
dotenvConfigOptions.config();
app.listen(process.env.PORT_NUMBER, () => {});
