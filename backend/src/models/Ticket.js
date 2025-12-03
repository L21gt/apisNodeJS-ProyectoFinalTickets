const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Ticket", {
    orderId: {
      type: DataTypes.STRING, // Un ID único para agrupar varios tickets (Ej: ORD-12345)
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("valid", "used", "cancelled"),
      defaultValue: "valid",
    },
  });
};
