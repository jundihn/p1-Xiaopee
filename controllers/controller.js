const { Product, Category, User, UserProfile } = require("../models");
const { Op } = require("sequelize");
const { format_currency } = require("../helpers");
const bcryptjs = require("bcryptjs");

class Controller {
  //session checker

  static async landingPage(req, res) {
    try {
      let userId = req.session.userId;
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      let balance = req.session.balance;

      let datas = await Category.findAll();

      let datas1 = await Product.findAll({ limit: 8 });
      res.render("landingPageQ", {
        title: "Landing Page",
        datas,
        datas1,
        format_currency,
        userId,
        isLoggedIn,
        role,
        balance,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async showAllProduct(req, res) {
    try {
      let { searchProduct } = req.query;
      let option = {};
      if (searchProduct) {
        option.where = {
          name: {
            [Op.iLike]: `%${searchProduct}%`,
          },
        };
      }
      let datas = await Product.findAll(option);
      // console.log(datas);
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      let balance = req.session.balance;
      // console.log(req.session.balance);
      console.log(balance);
      res.render("showAllProducts", {
        title: "Products List",
        datas,
        format_currency,
        isLoggedIn,
        role,
        balance,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async showAddProductForm(req, res) {
    try {
      let categories = await Category.findAll();
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      let balance = req.session.balance;
      res.render("formAddProduct", {
        title: "Form Add Product",
        categories,
        isLoggedIn,
        role,
        balance,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async addProductPost(req, res) {
    try {
      let { name, description, price, imageUrl, CategoryId } = req.body;
      await Product.create({ name, description, price, imageUrl, CategoryId });
      res.redirect("/products");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((err) => err.message);
        res.send(errors);
      } else {
        res.send(error);
      }
    }
  }

  static async showDetailProductById(req, res) {
    try {
      let { productId } = req.params;
      let data = await Product.findByPk(productId);
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      let balance = req.session.balance;
      res.render("detailProduct", {
        title: "Detail Product",
        data,
        format_currency,
        isLoggedIn,
        role,
        balance,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async showEditProduct(req, res) {
    try {
      let { productId } = req.params;
      let products = await Product.findByPk(productId, {
        include: Category,
      });
      // console.log(products);
      let categories = await Category.findAll();
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      res.render("formEditProduct", {
        title: "Form Edit Product",
        products,
        categories,
        isLoggedIn,
        role,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async detailProductUpdate(req, res) {
    try {
      let { productId } = req.params;
      let { name, description, price, CategoryId } = req.body;

      let data = await Product.findByPk(productId, {});
      await data.update({ name, description, price, CategoryId });
      // console.log(req.body);
      res.redirect(`/products`);
    } catch (error) {
      // console.log(error);
      res.send(error);
    }
  }

  static async showAllUser(req, res) {
    try {
      let { searchUser } = req.query;
      let option = {
        include: {
          model: User,
        },
      };
      if (searchUser) {
        option.where = {
          name: {
            [Op.iLike]: `%${searchUser}%`,
          },
        };
      }
      let datas = await UserProfile.findAll(option);
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      let balance = req.session.balance;
      res.render("showAllUsers", {
        title: "Users List",
        datas,
        isLoggedIn,
        role, balance
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteProductById(req, res) {
    try {
      let { productId } = req.params;
      await Product.destroy({ where: { id: productId } });
      res.redirect("/products");
    } catch (error) {
      res.send(error);
    }
  }

  static async showLoginForm(req, res) {
    try {
      let { error } = req.query;
      let isLoggedIn = req.session.isLoggedIn;
      res.render("loginQ", { title: "Login Form", error, isLoggedIn });
    } catch (error) {
      res.send(error);
    }
  }

  static async loginUserPost(req, res) {
    try {
      let { email, password } = req.body;
      // console.log(req.body);

      let data = await User.findOne({ where: { email } });
      // console.log(data);
      if (data) {
        let result = bcryptjs.compareSync(password, data.password); //admin
        let isLoggedIn = req.session.isLoggedIn;
        if (!result) {
          res.send("Username / Password salah!");
        } else {
          req.session.email = data.email;
          req.session.role = data.role;
          req.session.userId = data.id;
          req.session.isLoggedIn = true;
          let userBalance = await UserProfile.findOne({
            where: { UserId: data.id },
          });
          userBalance = userBalance.balance || 0;
          // console.log(userBalance);
          req.session.balance = userBalance;
          // console.log(data);

          res.redirect("/");
        }
      } else {
        // console.log(error);
        const errors = "tolong banget login dlu";
        res.redirect(`/login?error=${errors}`);
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async showSignupForm(req, res) {
    try {
      res.render("formSignup", { title: "Form Sign Up" });
    } catch (error) {
      res.send(error);
    }
  }

  static async signupUserPost(req, res) {
    try {
      let { email, password } = req.body;
      if (password) {
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);
        password = hash;
      }

      let newUser = await User.create({ email, password });
      User.nodeMailer(email);
      console.log(newUser);
      await UserProfile.create({
        UserId: newUser.id,
      });

      res.redirect("/");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((err) => err.message);
        res.send(errors);
      } else {
        res.send(error);
      }
    }
  }

  static async showProductByCategory(req, res) {
    try {
      let { id } = req.params;
      // console.log(id);

      let dataProduct = await Category.findByPk(id, {
        include: Product,
      });

      let data = dataProduct.Products;
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;

      // res.send(dataProduct)
      res.render("productByCategory", {
        data,
        format_currency,
        isLoggedIn,
        role,
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      res.send(error);
    }
  }

  static async showFormUserProfile(req, res) {
    try {
      let userId = req.session.userId;
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      let data = await UserProfile.findOne({
        where: {
          UserId: userId,
        },
      });

      // data.gender = data.gender.trim()

      res.render("formUserProfile", {
        title: "Form User Profile",
        data,
        userId,
        isLoggedIn,
        role,
      });
      // console.log(data);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async userProfilePost(req, res) {
    try {
      let { name, dateOfBirth, address, phoneNumber, gender } = req.body;
      let { userId } = req.session;
      // const genderTrim = gender.trim();
      let data = await UserProfile.findOne({
        where: {
          UserId: userId,
        },
      });
      console.log(data, "INI DATA");
      console.log(name, dateOfBirth, address, phoneNumber, gender);
      await data.update({
        name,
        dateOfBirth,
        address,
        phoneNumber,
        gender,
      });
      res.redirect("/");
    } catch (error) {
      res.send(error);
    }
  }

  static async showAllCategoryList(req, res) {
    try {
      let data = await Category.findAll();
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      let balance = req.session.balance;
      res.render("categoryList", { data, isLoggedIn, role, balance });
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddCategory(req, res) {
    try {
      let isLoggedIn = req.session.isLoggedIn;
      let role = req.session.role;
      res.render("addCategory", { isLoggedIn, role });
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddCategory(req, res) {
    try {
      // console.log(req.body);
      let { name, imageUrl } = req.body;
      await Category.create({ name, imageUrl });
      res.redirect("/category");
    } catch (error) {
      res.send(error);
    }
  }

  static async addItemsToCart(req, res) {
    try {
      let cart = req.session.cart;

      res.redirect("/");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
