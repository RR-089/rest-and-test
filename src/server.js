const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const router = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.all("*", (req, res) => {
  res.status(404).send(`Route not found for ${req.method} - ${req.url}`);
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}
