const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Message", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "read"),
      defaultValue: "new", // Por defecto, todo mensaje llega como "nuevo"
    },
  });
};
