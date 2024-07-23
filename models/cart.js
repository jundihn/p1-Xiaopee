'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.Product, {foreignKey: "ProductId"})
      Cart.belongsTo(models.User, {foreignKey: "UserId"})
      // Cart.belongsTo(models.TransactionDetail, {foreignKey: "CartId"})
    }
  }
  Cart.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};