import { RowDataPacket } from "mysql2";

export interface FavoriteCar extends RowDataPacket {
    favorite_id: number;        // Identificador único del registro (INT)
    user_id: number;            // ID del usuario que marcó como favorito (INT)
    license_plate: string;      // Placa del vehículo favorito (VARCHAR(6))
    added_date?: Date;           // Fecha en que se agregó a favoritos (TIMESTAMP)
}

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

export interface User extends RowDataPacket {
    id: number;
    c_name: string;
    address: string;
    phone: string;
    email: string ;
    password: string; 
    role_id: number;  
}

export interface Booking extends RowDataPacket {
    id: number;               // Correspondiente a INT 
    l_plate: string;         // Correspondiente a VARCHAR(6)
    c_id: number;            // Correspondiente a INT
    start_date: string;      // Correspondiente a DATE (puedes usar string o Date)
    end_date: string;        // Correspondiente a DATE (puedes usar string o Date)
    b_status: 'Pendiente' | 'Cancelada' | 'Completada' | 'Activa'; // Correspondiente a ENUM
    total_cost: string;      // Correspondiente a DECIMAL(10, 2), puedes usar string o number
}