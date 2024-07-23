"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
      Product.hasMany(models.Cart, { foreignKey: "ProductId" });
    }

    // static async getProductByCategory(category) {
    //   try {
    //     let option = {
    //       include: {
    //         model: sequelize.models.Product,
    //       },
    //       order: [['name']]
    //     }

    //     if (category) {
    //       option.where = {
    //         category
    //       }
    //     }

    //     let data = await Product.findAll(option)

    //     return data
    //   } catch (error) {
    //     throw error
    //   }
    // }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Nama tidak boleh kosong!",
          },
          notEmpty: {
            msg: "Nama tidak boleh kosong!",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description tidak boleh kosong!",
          },
          notEmpty: {
            msg: "Description tidak boleh kosong!",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price tidak boleh kosong!",
          },
          notEmpty: {
            msg: "Price tidak boleh kosong!",
          },
          min: {
            msg: "Harga tidak boleh 0",
            args: 1,
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      stock: {
        type: DataTypes.INTEGER,
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Pilih 1 kategori!",
          },
          notEmpty: {
            msg: "Pilih 1 kategori",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
