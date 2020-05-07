const { Router } = require("express");
const ContactController = require("./contact.controller");
const contactRouter = Router();

contactRouter.get("/", ContactController.listContacts);

contactRouter.post(
  "/",
  ContactController.validateCreateContact,
  ContactController.addContact
);

module.exports = contactRouter;
