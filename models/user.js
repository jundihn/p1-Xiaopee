"use strict";
const { Model } = require("sequelize");
const bcryptjs = require("bcryptjs");
var nodemailer = require("nodemailer");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, { foreignKey: "UserId" });
      User.hasMany(models.Cart, { foreignKey: "UserId" });
    }

    dateFormat() {
      return this.dateOfBirth.toISOString().slice(0, 10);
    }

    static async nodeMailer(email) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "marcoabel25@gmail.com",
          pass: "livk orbl blac qfeh",
        },
      });

      var mailOptions = {
        from: "marcoabel25@gmail.com",
        to: email,
        subject: "Congratulation, Your account has been registered",
        text: "Welcome to Xiopee, happy Xiaoping!",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Email tidak boleh kosong",
          },
          notNull: {
            msg: "Email tidak boleh kosong",
          },
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password tidak boleh kosong",
          },
          notNull: {
            msg: "Password tidak boleh kosong",
          },
          lengthPassChecker(pass) {
            if (pass.length < 8) {
              throw new Error("Minimum pass length is 8");
            }
          },
        },
      },
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((data, option) => {
    data.role = "admin";
  });
  // User.beforeCreate((data, option) => {
  //   const salt = bcryptjs.genSaltSync(10);
  //   const hash = bcryptjs.hashSync(this.password, salt);
  //   this.password = hash;
  // });
  return User;
};
