const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const contactRouter = require("./contacts/contact.router");
require("dotenv").config();

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.handleErrors();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
    this.server.use(morgan("tiny"));
  }

  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
  }
  handleErrors() {
    this.server.use((err, req, res, next) => {
      delete err.stack;
      next(err);
      return res.status(err.status).send(err.message);
    });
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server start listening on port", process.env.PORT);
    });
  }
};
