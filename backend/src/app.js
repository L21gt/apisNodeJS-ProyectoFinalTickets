const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas Base
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "API Events4U funcionando correctamente 🚀" });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);

module.exports = app;
