const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");

const contacts = require("../../db/contacts.json");
const contactsPath = path.join(__dirname, "../../db/contacts.json");

const Joi = require("joi");

module.exports = class ContactController {
  static listContacts(req, res, next) {
    return res.status(200).json(contacts);
  }

  static addContact(req, res, next) {
    const newContact = {
      ...req.body,
      id: contacts.length + 1,
    };
    contacts.push(newContact);
    const contactsToWrite = JSON.stringify(contacts);
    fsPromises.writeFile(contactsPath, contactsToWrite);
    return res.status(201).send(contacts);
  }

  static validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const result = Joi.validate(req.body, createContactRules);
    if (result.error) {
      return res.status(400).send({ message: `${result.error.message}` });
    }
    next();
  }
};
