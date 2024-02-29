const { Router } = require("express");
const userController = require("./../controllers/user.controller.js");
const userValidator = require("./../middlewares/user.validation.js");

const router = Router();

router.get("/users", userValidator.getAllUsers, userController.getAllUsers);
router.get("/users/:id", userValidator.getUserById, userController.getOneUser);
router.post("/users", userValidator.createUser, userController.createUser);
router.patch("/users/:id", userValidator.updateUser, userController.updateUser);
router.delete(
  "/users/:id",
  userValidator.deleteUser,
  userController.deleteUser
);

module.exports = router;
