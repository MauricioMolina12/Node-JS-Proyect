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
exports.validate_token = exports.id_token = exports.deleteTokens = exports.tokensExp = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = __importDefault(require("../db/connection"));
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const TOKEN_EXPIRATION = '1h'; // Por ejemplo, 1 hora
const generateToken = (req, res) => {
    // Revisa si el usuario fue autenticado
    if (!res.locals.authenticated) {
        res.status(401).json({ message: 'No autenticado' });
    }
    else {
        // Datos del usuario desde el controlador anterior
        const user = res.locals.user;
        // Genera un token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        // Calcula la fecha de expiración (1 hora desde el momento actual)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
        const date = new Date(Date.now());
        // Responde con el token
        connection_1.default.query('INSERT INTO UserTokens (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)', [user.id, token, expiresAt, date], (error, data) => {
            if (error) {
                return res.status(500).json({ message: 'Error al guardar el token en la base de datos' });
            }
            // Devuelve el token y el usuario al cliente
            res.json({
                message: 'Inicio de sesión exitoso',
                token,
                expiresAt,
                user: {
                    id: user.id,
                    email: user.email,
                },
            });
            (0, exports.tokensExp)(date);
        });
    }
};
exports.generateToken = generateToken;
const tokensExp = (date) => {
    connection_1.default.query('DELETE FROM UserTokens WHERE expires_at < ?', date, (error) => {
        if (error)
            console.error('Error eliminando tokens caducados:', error);
    });
};
exports.tokensExp = tokensExp;
const deleteTokens = (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extrae el token del encabezado Authorization
    if (!token) {
        res.status(400).json({ message: 'Token no proporcionado' });
    }
    else {
        // Elimina el token de la base de datos
        connection_1.default.query('DELETE FROM UserTokens WHERE token = ?', [token], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error al procesar el logout' });
            }
            res.json({ message: 'Logout exitoso' });
        });
        const date = new Date(Date.now());
        (0, exports.tokensExp)(date);
    }
};
exports.deleteTokens = deleteTokens;
const id_token = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica la firma y la expiración del token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Decodifica el token
        return decoded.userId;
    }
    catch (err) {
        return;
    }
});
exports.id_token = id_token;
const validate_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const date = new Date(Date.now());
    try {
        // Verifica la firma y la expiración del token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Decodifica el token
        req.body.userId = decoded.userId;
        (0, exports.tokensExp)(date);
        // Si la verificación es exitosa, devuelve la respuesta de validación
        res.json({ valid: true });
    }
    catch (err) {
        // Si el token es inválido o ha expirado, devuelve un error
        res.status(401).json({ valid: false, message: 'Token inválido o expirado' });
    }
});
exports.validate_token = validate_token;
