import { Request, Response } from "express";
import connection from "../db/connection";
import { Car, FavoriteCar } from "../interfaces";
import { id_token } from "./users_tokens.controller";

export const getUserFavorites = async (req: Request, res: Response) => {
    const userId = await id_token(req.params.userId);

    connection.query<Car[]>(
    `SELECT c.* 
    FROM FavoriteCars fc 
    JOIN Cars c ON fc.license_plate = c.license_plate 
    WHERE fc.user_id = ?`, [userId], ((error, data) => {
        if(error) throw error;        
        res.json(data)        
    }));
}

export const addFavoriteCar = async (req: Request, res: Response) => {
    const userId = await id_token(req.body.token);

    const { licensePlate } = req.body;

    // Verificar si el carro ya está en los favoritos
    connection.query<FavoriteCar[]>(
        'SELECT * FROM FavoriteCars WHERE user_id = ? AND license_plate = ?',
        [userId, licensePlate],
        (error, data) => {
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
            connection.query(
                'INSERT INTO FavoriteCars (user_id, license_plate, added_date) VALUES (?, ?, ?)',
                [userId, licensePlate, date],
                (insertError, insertData) => {
                    if (insertError) {
                        console.error(insertError);
                        return res.status(500).json({ error: 'Error al agregar el favorito' });
                    }
                    res.json({ message: 'Carro favorito agregado correctamente' });
                }
            );
        }
    );
};

export const delFavoriteCar = async (req: Request, res: Response) => {
    const userId = await id_token(req.headers.authorization?.split(' ')[1] || '') ;


    const { licensePlate } = req.params;   
    
    connection.query('DELETE FROM FavoriteCars WHERE license_plate = ? AND user_id = ?', [licensePlate, userId], 
        (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al agregar el favorito' });
            }
            res.json({ message: 'Carro favorito eliminado correctamente' });
        }
    )
    
}