import { Request, Response } from "express";
import connection from "../db/connection";
import { RowDataPacket } from "mysql2";

export interface Car extends RowDataPacket {
    license_plate: string;      // Placa del vehículo (VARCHAR(6))
    brand: string;              // Marca del vehículo (VARCHAR(30))
    model: string;              // Modelo del vehículo (VARCHAR(30))
    car_year: number;           // Año del vehículo (YEAR)
    color: string;              // Color del vehículo (VARCHAR(150))
    mileage: number;            // Kilometraje del vehículo (INT)
    car_type: 'Sedan' | 'SUV' | 'Moto' | 'Camion' | 'Camioneta'; // Tipo de vehículo (ENUM)
    daily_fee: number;          // Tarifa diaria (DECIMAL(10, 2))
    seats: number;              // Número de asientos (INT)
    image_path: string;         // Ruta de la imagen (VARCHAR(255))
  }


export const getCars = (req: Request, res: Response) => {
    connection.query('SELECT * FROM Cars', ((error, data) => {
        if(error) throw error;
        res.json(data);
    }))
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
        })
    }))
}