import { Request, Response } from "express";
import connection from "../db/connection";
import { Car } from "../interfaces";


export const getCars = (req: Request, res: Response) => {
    connection.query('SELECT * FROM Cars', ((error, data) => {
        if(error) throw error;
        res.json(data);
    }));
}

export const getCar = (req: Request, res: Response) => {

    const { id } = req.params;
    
    connection.query<Car[]>('SELECT * FROM Cars WHERE license_plate = ?', id, ((error, data) => {
        if(error) throw error;
        res.json(data[0]);
    }))
}

export const deleteCar = (req: Request, res: Response) => {

    const { id } = req.params;
    
    connection.query('DELETE FROM Cars WHERE license_plate = ?', id, ((error, data) => {
        if(error) throw error;
        res.json({
            msg: "successfull car delete",
            id: id
        })
    }))
}

export const postCar = (req: Request, res: Response) => {

    const { body } = req;
    
    connection.query('INSERT INTO Cars set ?', [body], ((error, data) => {
        if(error) throw error;
        res.json({
            msg: "successfull car insert",
            body: body
        })
    }))
}

export const putCar = (req: Request, res: Response) => {

    const { id } = req.params;
    const { body } = req;
    
    connection.query('UPDATE Cars SET ? WHERE license_plate = ?', [body, id], ((error, data) => {
        if(error) throw error;
        res.json({
            msg: "successfull car update",
            body: body
        });
    }))
}

export const availableCar = (req: Request, res: Response) => {

    const { start, end, license_plate } = req.body;
    
    connection.query('SELECT isitavailable(?, ?, ?) AS is_available', [start, end, license_plate], ((error, data) => {
        if(error) throw error;
        res.json(data);
    }))
}

export const total_cost = (req: Request, res: Response) => {
    const { start, end, license_plate } = req.body;
    
    connection.query('SELECT total_price(?, ?, ?) AS total_cost', [start, end, license_plate], ((error, data) => {
        if(error) throw error;
        res.json(data);
    }))
}