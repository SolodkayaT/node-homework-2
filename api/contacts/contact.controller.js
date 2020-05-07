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

  static getContact(req, res, next) {
    const id = parseInt(req.params.id);
    const targetContactIndex = contacts.findIndex(
      (contact) => contact.id === id
    );
    if (targetContactIndex === -1) {
      return res.status(404).send({ message: "Not found" });
    }
    return res.status(200).send(contacts[targetContactIndex]);
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

  static updateContact(req, res, next) {
    const id = parseInt(req.params.id);
    const targetContactIndex = contacts.findIndex(
      (contact) => contact.id === id
    );
    if (targetContactIndex === -1) {
      return res.status(404).send({ message: "Not found" });
    }
    contacts[targetContactIndex] = {
      ...contacts[targetContactIndex],
      ...req.body,
    };
    const contactsToWrite = JSON.stringify(contacts);
    fsPromises.writeFile(contactsPath, contactsToWrite);
    return res.status(200).send(contacts);
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

  static validateUpdateContact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const requestBodyLength = Object.keys(req.body).length;
    const result = Joi.validate(req.body, updateContactRules);

    if (requestBodyLength === 0) {
      return res.status(400).send({ message: "missing fields" });
    }
    if (result.error) {
      return res.status(400).send({ message: result.error.message });
    }
    next();
  }
};
