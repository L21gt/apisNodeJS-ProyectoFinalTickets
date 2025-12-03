const { Sequelize } = require("sequelize");
const config = require("../config/database.js");

// Determinar el entorno (development, test, production)
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Crear la conexión
let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const db = {};

// Importar modelos
db.User = require("./User")(sequelize);
db.Category = require("./Category")(sequelize);
db.Event = require("./Event")(sequelize);
db.Ticket = require("./Ticket")(sequelize);
db.Message = require("./Message")(sequelize);

// Definir Relaciones (Associations)

// 1. Un Evento pertenece a una Categoría
db.Category.hasMany(db.Event, { foreignKey: "categoryId" });
db.Event.belongsTo(db.Category, { foreignKey: "categoryId" });

// 2. Un Ticket pertenece a un Usuario (Comprador)
db.User.hasMany(db.Ticket, { foreignKey: "userId" });
db.Ticket.belongsTo(db.User, { foreignKey: "userId" });

// 3. Un Ticket pertenece a un Evento
db.Event.hasMany(db.Ticket, { foreignKey: "eventId" });
db.Ticket.belongsTo(db.Event, { foreignKey: "eventId" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
