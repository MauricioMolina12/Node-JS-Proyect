"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTokens = exports.tokensExp = exports.generateToken = void 0;
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
    const { id_user, token } = req.body;
    connection_1.default.query('DELETE FROM UserTokens WHERE id_user = ? AND token = ?', [id_user, token], (error) => {
        if (error)
            console.error('Error eliminando tokens caducados:', error);
        res.json({
            msg: "logout succesfull"
        });
    });
    const date = new Date(Date.now());
    (0, exports.tokensExp)(date);
};
exports.deleteTokens = deleteTokens;
