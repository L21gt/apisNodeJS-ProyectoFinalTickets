require("dotenv").config();
const app = require("./app");
const db = require("./models"); // Importar la conexión DB

const PORT = process.env.PORT || 3000;

// Sincronizar base de datos y luego iniciar servidor
// force: false significa "NO borres las tablas si ya existen"
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced 📦");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });
