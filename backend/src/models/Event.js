const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Event", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING, // Aquí guardaremos la URL de Cloudinary
      allowNull: true,
    },
    // Gestión de Boletos (Simplificada en el mismo modelo como acordamos)
    ticketType: {
      type: DataTypes.STRING, // Ej: "General", "VIP"
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
