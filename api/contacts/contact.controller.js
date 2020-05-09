const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");
const contacts = require("../../db/contacts.json");
const contactsPath = path.join(__dirname, "../../db/contacts.json");
const Joi = require("joi");

class ContactController {
  get getContact() {
    return this._getContact.bind(this);
  }
  get updateContact() {
    return this._updateContact.bind(this);
  }
  get removeContact() {
    return this._removeContact.bind(this);
  }
  get addContact() {
    return this._addContact.bind(this);
  }

  listContacts(req, res, next) {
    return res.status(200).json(contacts);
  }

  _getContact(req, res, next) {
    try {
      const targetContactIndex = this.findContactIndexById(req.params.id);
      if (targetContactIndex === undefined) {
        return res.status(404).send({ message: "Not found" });
      }
      return res.status(200).send(contacts[targetContactIndex]);
    } catch (error) {
      next(error);
    }
  }

  _addContact(req, res, next) {
    try {
      const newContact = {
        ...req.body,
        id: contacts.length + 1,
      };
      contacts.push(newContact);
      this.writeContactToDataBase(contacts);
      return res.status(201).send(contacts);
    } catch (error) {
      next(error);
    }
  }

  _updateContact(req, res, next) {
    try {
      const targetContactIndex = this.findContactIndexById(req.params.id);
      console.log(targetContactIndex);
      if (targetContactIndex === undefined) {
        return res.status(404).send({ message: "Not found" });
      }
      contacts[targetContactIndex] = {
        ...contacts[targetContactIndex],
        ...req.body,
      };
      this.writeContactToDataBase(contacts);
      return res.status(200).send(contacts);
    } catch (error) {
      next(error);
    }
  }

  _removeContact(req, res, next) {
    try {
      const targetContactIndex = this.findContactIndexById(req.params.id);
      if (targetContactIndex === undefined) {
        return res.status(404).send({ message: "Not found" });
      }
      contacts.splice(targetContactIndex, 1);
      this.writeContactToDataBase(contacts);
      return res.status(200).send({ message: "Contact deleted" });
    } catch (error) {
      next(error);
    }
  }
  validateCreateContact(req, res, next) {
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

  validateUpdateContact(req, res, next) {
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
  findContactIndexById(contactId) {
    const id = parseInt(contactId);
    const targetContactIndex = contacts.findIndex(
      (contact) => contact.id === id
    );
    if (targetContactIndex === -1) {
      return;
    }
    return targetContactIndex;
  }
  writeContactToDataBase(newContacts) {
    const contactsToWrite = JSON.stringify(newContacts);
    return fsPromises.writeFile(contactsPath, contactsToWrite);
  }
}

module.exports = new ContactController();
