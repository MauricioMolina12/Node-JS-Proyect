"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putPersona = exports.postPersona = exports.deletePersona = exports.getPersona = exports.getPersonas = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getPersonas = (req, res) => {
    connection_1.default.query('SELECT * FROM Users', ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
};
exports.getPersonas = getPersonas;
const getPersona = (req, res) => {
    //esto es desestructuracion de el diccionario que da req.params y coge el valor que tenga de llave id y crea una variable id
    const { id } = req.params;
    connection_1.default.query('SELECT * FROM Users WHERE id = ?', id, (error, data) => {
        if (error)
            throw error;
        const firstResult = data[0];
        res.json(firstResult);
    });
};
exports.getPersona = getPersona;
const deletePersona = (req, res) => {
    //esto es desestructuracion de el diccionario que da req.params y coge el valor que tenga de llave id y crea una variable id
    const { id } = req.params;
    connection_1.default.query('DELETE FROM Users WHERE id = ?', id, (error, data) => {
        if (error)
            throw error;
        res.json({
            msg: "successfull user delete",
            id: id
        });
    });
};
exports.deletePersona = deletePersona;
const postPersona = (req, res) => {
    const { body } = req;
    connection_1.default.query('INSERT INTO Users set ?', [body], (error, data) => {
        if (error)
            throw error;
        res.json({
            msg: "successfull user insert",
            body: body
        });
    });
};
exports.postPersona = postPersona;
const putPersona = (req, res) => {
    const { body } = req;
    const { id } = req.params;
    connection_1.default.query('UPDATE Users SET ? WHERE id = ?', [body, id], (error, data) => {
        if (error)
            throw error;
        res.json({
            msg: "successfull user insert",
            body: body
        });
    });
};
exports.putPersona = putPersona;
