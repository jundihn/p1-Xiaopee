const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

// define the home page route

//SignUp User
router.get("/signup", Controller.showSignupForm);
router.post("/signup", Controller.signupUserPost);
//END OF SignUpUser

//Login user
router.get("/login", Controller.showLoginForm);
router.post("/login", Controller.loginUserPost);

//Logout
router.get("/logout", Controller.logout);

//SESSION

let authCheck = function (req, res, next) {
   
  if (!req.session.email) {
    const error = "You did not login yet! :D";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

let roleAdmin = function (req, res, next) {
  // console.log(req.session);

  if (req.session.role !== "admin") {
    const error = "You did not have access! :D";
    res.redirect(`/?error=${error}`);
  } else {
    next();
  }
};

router.get("/", authCheck, Controller.landingPage);

//READ PRODUCT
router.get("/products", authCheck, Controller.showAllProduct);
//END OF READ PRODUCT

//Add Category
router.get("/category", authCheck, Controller.showAllCategoryList);
router.get("/category/add", authCheck, Controller.getAddCategory);
router.post("/category/add", authCheck, Controller.postAddCategory);
//END OF ADD CATEGORY

//ADD PRODUCT
router.get("/product/add", authCheck, Controller.showAddProductForm);
router.post("/product/add", authCheck, Controller.addProductPost);
//END OF ADD PRODUCT

//menampilkan product berdasarkan categorynya
router.get("/product/category/:id", Controller.showProductByCategory);

//Menampilkan detail product
router.get("/product/:productId", authCheck, Controller.showDetailProductById);

//EDIT
router.get("/product/:productId/edit", authCheck, Controller.showEditProduct);
router.post(
  "/product/:productId/edit",
  authCheck,
  Controller.detailProductUpdate
);
//END OF EDIT

//READ USER
router.get("/users", authCheck, roleAdmin, Controller.showAllUser);
//END OF READ USER

//Logout user

//User Profile
router.get("/userProfile/:userId", authCheck, Controller.showFormUserProfile);
router.post("/userProfile/:userId", authCheck, Controller.userProfilePost);

//DELETE
router.get("/users/:id/delete");
router.get(
  "/products/:productId/delete",
  authCheck,
  Controller.deleteProductById
);
//END OF DELETE

module.exports = router;
