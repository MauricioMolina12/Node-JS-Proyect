import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import connection from "../db/connection";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const TOKEN_EXPIRATION = '1h'; // Por ejemplo, 1 hora


export const generateToken = (req: Request, res: Response): void => {
    // Revisa si el usuario fue autenticado
    if (!res.locals.authenticated) {
        res.status(401).json({ message: 'No autenticado' });
    }
    else{
        // Datos del usuario desde el controlador anterior
        const user = res.locals.user;

        // Genera un token JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
        
        // Calcula la fecha de expiración (1 hora desde el momento actual)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        const date = new Date(Date.now());
        // Responde con el token
        connection.query(
            'INSERT INTO UserTokens (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)',
            [user.id, token, expiresAt, date],
            (error, data) => {
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
                tokensExp(date);
            }
        );
    }
};


export const tokensExp = (date: Date) =>{
    connection.query(
        'DELETE FROM UserTokens WHERE expires_at < ?', date,
        (error) => {
            if (error) console.error('Error eliminando tokens caducados:', error);
        }
    );
}

export const deleteTokens = (req: Request, res: Response) =>{

    const token = req.headers.authorization?.split(' ')[1]; // Extrae el token del encabezado Authorization

    
    if (!token) {
        res.status(400).json({ message: 'Token no proporcionado' });
    } else {
        // Elimina el token de la base de datos
        connection.query('DELETE FROM UserTokens WHERE token = ?', [token], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error al procesar el logout' });
            }

            res.json({ message: 'Logout exitoso' });
        });

        const date = new Date(Date.now());
        
        tokensExp(date);
    }
    
    
}