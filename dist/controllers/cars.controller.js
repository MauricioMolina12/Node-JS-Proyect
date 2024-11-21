"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableCar = exports.putCar = exports.postCar = exports.deleteCar = exports.getCar = exports.getCars = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getCars = (req, res) => {
    connection_1.default.query('SELECT * FROM Cars', ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
};
exports.getCars = getCars;
const getCar = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('SELECT * FROM Cars WHERE license_plate = ?', id, ((error, data) => {
        if (error)
            throw error;
        res.json(data[0]);
    }));
};
exports.getCar = getCar;
const deleteCar = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('DELETE FROM Cars WHERE license_plate = ?', id, ((error, data) => {
        if (error)
            throw error;
        res.json({
            msg: "successfull car delete",
            id: id
        });
    }));
};
exports.deleteCar = deleteCar;
const postCar = (req, res) => {
    const { body } = req;
    connection_1.default.query('INSERT INTO Cars set ?', [body], ((error, data) => {
        if (error)
            throw error;
        res.json({
            msg: "successfull car insert",
            body: body
        });
    }));
};
exports.postCar = postCar;
const putCar = (req, res) => {
    const { id } = req.params;
    const { body } = req;
    connection_1.default.query('UPDATE Cars SET ? WHERE license_plate = ?', [body, id], ((error, data) => {
        if (error)
            throw error;
        res.json({
            msg: "successfull car update",
            body: body
        });
    }));
};
exports.putCar = putCar;
const availableCar = (req, res) => {
    const { start, end, license_plate } = req.body;
    connection_1.default.query('SELECT isitavailable(?, ?, ?) AS is_available', [start, end, license_plate], ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
};
exports.availableCar = availableCar;
