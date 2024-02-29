const { query, param, body } = require("express-validator");
const userValidation = {
  getAllUsers: [query("username").isString().escape().optional()],
  getUserById: [
    param("id").notEmpty().isUUID().withMessage("id should be an uuid"),
  ],
  createUser: [
    body("username")
      .notEmpty()
      .withMessage("username should not be empty")
      .isString(),
    body("email")
      .isEmail()
      .withMessage("please input the correct email")
      .optional(),
    body("age")
      .notEmpty()
      .withMessage("age should not be empty")
      .isInt({ min: 1 })
      .withMessage("age should be a positive integer"),
  ],
  updateUser: [
    body("username").isString().optional(),
    body("email")
      .isEmail()
      .withMessage("please input the correct email")
      .optional(),
    body("age")
      .isInt()
      .custom((age) => {
        if (age <= 0) throw new Error("age cannot less than or equal 0");
      })
      .optional(),
  ],
  deleteUser: [param("id").notEmpty().isUUID()],
};

module.exports = userValidation;
