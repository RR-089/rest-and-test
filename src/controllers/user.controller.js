const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

const validate = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return null;
};

const getAllUsers = async (req, res) => {
  try {
    const validationError = validate(req, res);
    if (validationError) {
      return;
    }

    const { username } = req.query;
    if (username) {
      const allUsers = await prisma.user.findMany({
        where: { username: { contains: username } },
      });

      return res.json(allUsers);
    }

    const allUsers = await prisma.user.findMany({});

    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch users has been failed" });
  }
};

const getOneUser = async (req, res) => {
  try {
    const validationError = validate(req, res);
    if (validationError) {
      return;
    }
    const id = req.params.id;

    const user = await prisma.user.findFirst({ where: { id } });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch user has been failed" });
  }
};

const createUser = async (req, res) => {
  try {
    const validationError = validate(req, res);
    if (validationError) {
      return;
    }
    const { username, email, age } = req.body;

    if (email !== "" || email !== undefined) {
      const existingUser = await prisma.user.findFirst({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    const createUser = await prisma.user.create({
      data: {
        username,
        email,
        age,
      },
    });

    res.status(201).json({ message: "User created", createdUser: createUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Creation user has been failed" });
  }
};

const updateUser = async (req, res) => {
  try {
    const validationError = validate(req, res);
    if (validationError) {
      return;
    }
    const id = req.params.id;
    const { username, email, age } = req.body;

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(age && { age }),
      },
    });

    res.json({ message: "User updated", updatedUser: updateUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update user has been failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const validationError = validate(req, res);
    if (validationError) {
      return;
    }
    const id = req.params.id;

    const deleteUser = await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted", deletedUser: deleteUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Deletion user has been failed" });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
