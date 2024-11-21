import { Request, Response } from "express";
import connection from "../db/connection";
import { Booking } from "../interfaces";



export const getBookings = (req: Request, res: Response) => {
    connection.query('SELECT * FROM Bookings', ((error, data) => {
        if(error) throw error;
        res.json(data);
    }))
}

export const getBooking = (req: Request, res: Response) => {

    const { id } = req.params;
    
    connection.query<Booking[]>('SELECT * FROM Bookings WHERE id = ?', id, ((error, data) => {
        if(error) throw error;  
        res.json(data[0]);
    }))
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

export const postBookings = (req: Request, res: Response) => {

    const { d_start, d_end, id_car, id_cos } = req.body;
    
    connection.query('CALL make_a_booking(?, ?, ?, ?)', [d_start, d_end, id_car, id_cos], ((error, data) => {
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


