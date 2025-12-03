require("dotenv").config();
const app = require("./app");
const db = require("./models"); // Importar la conexión DB

const PORT = process.env.PORT || 3000;

// Sincronizar base de datos y luego iniciar servidor
// force: false significa "NO borres las tablas si ya existen"
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Base de datos sincronizada 📦");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
