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
exports.verifyUserCredentials = exports.putUser = exports.postUser = exports.deleteUser = exports.getCustomer = exports.getUser = exports.getUsers = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10; // Número de rondas para el salt de bcrypt
const getUsers = (req, res) => {
    connection_1.default.query('SELECT id, c_name, address, phone, email FROM Users', ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
};
exports.getUsers = getUsers;
const getUser = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('SELECT id, c_name, address, phone, email FROM Users WHERE id = ?', id, (error, data) => {
        if (error)
            throw error;
        res.json(data[0]);
    });
};
exports.getUser = getUser;
const getCustomer = (req, res) => {
    connection_1.default.query('SELECT id, c_name, address, phone, email FROM Users WHERE role_id = 4', ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
};
exports.getCustomer = getCustomer;
const deleteUser = (req, res) => {
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
exports.deleteUser = deleteUser;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        // Hashear la contraseña
        if (body.password) {
            body.password = yield bcrypt_1.default.hash(body.password, saltRounds);
        }
        connection_1.default.query('INSERT INTO Users SET ?', [body], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                });
            }
            ;
            res.json({
                msg: "User successfully created",
                body: body
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error creating user",
            error: e
        });
    }
});
exports.postUser = postUser;
// Función para actualizar un usuario
const putUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        // Hashear la contraseña solo si existe en el cuerpo de la solicitud
        if (body.password) {
            body.password = yield bcrypt_1.default.hash(body.password, saltRounds);
        }
        connection_1.default.query('UPDATE Users SET ? WHERE id = ?', [body, id], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                });
            }
            ;
            res.json({
                msg: "User successfully updated",
                body: body
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error updating user",
            error: e
        });
    }
});
exports.putUser = putUser;
const verifyUserCredentials = (req, res, next) => {
    const { email, password } = req.body;
    connection_1.default.query('SELECT * FROM Users WHERE email = ?', [email], (error, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.length === 0) {
            return res.status(401).json({ message: 'Email inválido' });
        }
        const user = data[0];
        // Compara la contraseña ingresada con la almacenada (que está cifrada)
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password inválido' });
        }
        // Retorna el usuario para el controlador de UserToken
        res.locals.user = {
            id: user.id,
            name: user.c_name,
            email: user.email,
            role: user.role_id,
            phone: user.phone,
            address: user.address
            // Puedes agregar otros datos del usuario si los necesitas
        };
        // Continúa con el siguiente middleware (el controlador de token)
        res.locals.authenticated = true;
        next();
    }));
};
exports.verifyUserCredentials = verifyUserCredentials;
