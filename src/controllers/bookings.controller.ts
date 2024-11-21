import { Request, Response } from "express";
import connection from "../db/connection";
import { Booking } from "../interfaces";
import { id_token } from "./users_tokens.controller";



export const getBookings = async (req: Request, res: Response) => {

    const userId = await id_token(req.params.token);

    connection.query<any>('SELECT role_id FROM Users WHERE id = ?', [userId], (error, data) => {
        if(error) throw error;
        if (data[0]?.role_id === 4) {
            connection.query('SELECT * FROM bookings_customers WHERE id_cliente = ?', [userId], ((error, data) => {
                if(error) throw error;
                res.json(data);
            }))
        } else {
            connection.query('SELECT * FROM bookings_customers;', ((error, data) => {
                if(error) throw error;
                res.json(data);
            }))
        }
    })

    
}

export const deleteBookings = (req: Request, res: Response) => {

    const { id } = req.params;
    
    connection.query('DELETE FROM Bookings WHERE id = ?', id, ((error, data) => {
        if(error) throw error;
        res.json({
            msg: "successfull booking delete",
            id: id,
        })
    }))
}

export const postBookings = async (req: Request, res: Response) => {

    const { d_start, d_end, id_car, token } = req.body;

    const userId = await id_token(token);
    
    connection.query('CALL make_a_booking(?, ?, ?, ?)', [d_start, d_end, id_car, userId], ((error, data) => {
        if(error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            })
        };
        res.json({
            msg: "successfull booking insert",            
            data: data
        })
    }))
}

export const putCancelBookings = (req: Request, res: Response) => {
    
    const { id } = req.params;
    const { customer } = req.body;

    connection.query('CALL cancel_booking(?, ?)', [id, customer], ((error, data) => {
        if(error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            })
        };
        res.json({
            msg: "successfull booking cancelled",            
            data: data
        })
    }))
    
}

export const putModifyBookings = (req: Request, res: Response) => {

    const { id_user, d_start, d_end, id_car} = req.body;
    const { id } = req.params;

    connection.query('CALL update_booking_price(?, ?, ?, ?, ?)', [id_user, id, d_start, d_end, id_car], ((error, data) => {
        if(error){
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            })
        };
        res.json({
            msg: "successfull booking modify",            
            data: data
        })
    }));
}


