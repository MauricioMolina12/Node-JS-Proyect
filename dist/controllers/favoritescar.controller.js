"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delFavoriteCar = exports.addFavoriteCar = exports.getUserFavorites = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const users_tokens_controller_1 = require("./users_tokens.controller");
const getUserFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield (0, users_tokens_controller_1.id_token)(req.params.userId);
    connection_1.default.query(`SELECT c.* 
    FROM FavoriteCars fc 
    JOIN Cars c ON fc.license_plate = c.license_plate 
    WHERE fc.user_id = ?`, [userId], ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
});
exports.getUserFavorites = getUserFavorites;
const addFavoriteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield (0, users_tokens_controller_1.id_token)(req.body.token);
    const { licensePlate } = req.body;
    // Verificar si el carro ya está en los favoritos
    connection_1.default.query('SELECT * FROM FavoriteCars WHERE user_id = ? AND license_plate = ?', [userId, licensePlate], (error, data) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al verificar si ya es favorito' });
        }
        // Si ya existe en los favoritos, respondemos con un mensaje
        if (data.length > 0) {
            return res.status(400).json({ message: 'Este carro ya está en tus favoritos' });
        }
        const date = new Date(Date.now());
        // Si no existe, procedemos con la inserción
        connection_1.default.query('INSERT INTO FavoriteCars (user_id, license_plate, added_date) VALUES (?, ?, ?)', [userId, licensePlate, date], (insertError, insertData) => {
            if (insertError) {
                console.error(insertError);
                return res.status(500).json({ error: 'Error al agregar el favorito' });
            }
            res.json({ message: 'Carro favorito agregado correctamente' });
        });
    });
});
exports.addFavoriteCar = addFavoriteCar;
const delFavoriteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = yield (0, users_tokens_controller_1.id_token)(((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '');
    const { licensePlate } = req.params;
    connection_1.default.query('DELETE FROM FavoriteCars WHERE license_plate = ? AND user_id = ?', [licensePlate, userId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al agregar el favorito' });
        }
        res.json({ message: 'Carro favorito eliminado correctamente' });
    });
});
exports.delFavoriteCar = delFavoriteCar;
