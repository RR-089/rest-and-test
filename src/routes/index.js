const { Router } = require("express");

const userRouter = require("./user.router.js");

const router = Router();

router.use(userRouter);

module.exports = router;
