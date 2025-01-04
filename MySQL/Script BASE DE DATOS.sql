CREATE DATABASE reserva_vehiculos;

-- SAMUEL MALDONADO y CESAR RODRIGUEZ

USE reserva_vehiculos;

CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name ENUM('Administrador', 'Gerente', 'Empleado', 'Cliente') NOT NULL
);

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    c_name VARCHAR(100) NOT NULL,
    address VARCHAR(150),
    phone VARCHAR(10),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL ,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

CREATE TABLE UserTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Cars (
    license_plate VARCHAR(6) PRIMARY KEY,
    brand VARCHAR(30) NOT NULL,
    model VARCHAR(30) NOT NULL,
    car_year YEAR NOT NULL,
    mileage INT NOT NULL,
    car_type ENUM('Sedan', 'SUV', 'Moto', 'Camion', 'Camioneta') NOT NULL,
    daily_fee DECIMAL(10, 2) NOT NULL,
    seats INT NOT NULL,              -- Número de asientos
    image_path VARCHAR(255),          -- Ruta de la imagen
    transmission ENUM('Automatic', 'Manual') NOT NULL
);


CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    l_plate VARCHAR(6) NOT NULL,
    c_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    b_status ENUM('Pendiente', 'Cancelada', 'Completada', 'Activa') NOT NULL ,
    total_cost DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (l_plate) REFERENCES Cars(license_plate),
    FOREIGN KEY (c_id) REFERENCES Users(id)
);

CREATE TABLE BookingsAudit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    l_plate VARCHAR(6),
    c_id INT,
    start_date DATE,
    end_date DATE,
    b_status VARCHAR(30),
    total_cost DECIMAL(10, 2),
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_details VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES Bookings(id)
);

CREATE TABLE FavoriteCars (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único para cada registro
    user_id INT NOT NULL,                       -- Identificador del usuario
    license_plate VARCHAR(6) NOT NULL,          -- Placa del carro favorito
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora en que se agregó a favoritos
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, -- Relación con la tabla Users
    FOREIGN KEY (license_plate) REFERENCES Cars(license_plate) ON DELETE CASCADE -- Relación con la tabla Cars
);



CREATE INDEX idx_user_email ON Users(email);
CREATE INDEX idx_bookings_start_date ON Bookings(start_date);
CREATE INDEX idx_bookings_end_date ON Bookings(end_date);
CREATE INDEX idx_bookings_b_status ON Bookings(b_status);
CREATE INDEX idx_cars_car_type ON Cars(car_type);


INSERT INTO Roles (role_name) VALUES 
('Administrador'),
('Gerente'),
('Empleado'),
('Cliente');

INSERT INTO Users (c_name, address, phone, email, password, role_id) VALUES 
('Juan Pérez', 'Calle Falsa 123', '1234567890', 'juan.perez@example.com', 'hashed_password_1', 4),
('Ana Gómez', 'Avenida Siempre Viva 456', '0987654321', 'ana.gomez@example.com', 'hashed_password_2', 4),
('Luis Martínez', 'Paseo del Río 789', '5678901234', 'luis.martinez@example.com', 'hashed_password_3', 4),
('María López', 'Calle de la Paz 321', '4321098765', 'maria.lopez@example.com', 'hashed_password_4', 4),
('Patricia López', 'Calle del Río 67', '7897897890', 'patricia.lopez@example.com', 'hashed_password_11', 3), -- Empleado
('Fernando Jiménez', 'Avenida Libertad 34', '8908908901', 'fernando.jimenez@example.com', 'hashed_password_12', 2), -- Gerente
('Laura González', 'Calle del Mar 56', '9019019012', 'laura.gonzalez@example.com', 'hashed_password_13', 1); -- Administrador

INSERT INTO Cars (license_plate, brand, model, car_year, mileage, car_type, daily_fee, seats, image_path, transmission) VALUES 
('ABC123', 'Toyota', 'Corolla', 2020, 15000, 'Sedan', 30.00, 5, 'assets/corolla.webp', 'Automatic'),
('XYZ789', 'Honda', 'CR-V', 2019, 25000, 'SUV', 50.00, 7, 'assets/honda-crv.webp', 'Automatic'),
('MNO456', 'Yamaha', 'YZF-R3', 2022, 5000, 'Moto', 20.00, 2, 'assets/yamaha-yzf-r3.webp', 'Manual'),
('JKL012', 'Ford', 'F-150', 2021, 10000, 'Camioneta', 70.00, 5, 'assets/fordf.webp', 'Automatic'),
('DEF345', 'Chevrolet', 'Silverado', 2023, 2000, 'Camioneta', 65.00, 5, 'assets/silverado.webp', 'Automatic');


INSERT INTO Bookings (l_plate, c_id, start_date, end_date, b_status, total_cost) VALUES 
('DEF345', 11, '2024-12-01', '2024-12-06', 'Pendiente', 455.00);
('ABC123', 6, '2024-11-18', '2024-11-25', 'Completada', 150.00),
('ABC123', 4, '2024-01-01', '2024-01-05', 'Completada', 150.00),
('XYZ789', 3, '2024-01-10', '2024-01-15', 'Completada', 300.00),
('MNO456', 1, '2024-02-01', '2024-02-03', 'Completada', 60.00), 
('JKL012', 2, '2024-02-05', '2024-02-12', 'Cancelada', 560.00),  
('DEF345', 1, '2024-03-01', '2024-03-06', 'Completada', 455.00), 
('ABC123', 2, '2024-03-10', '2024-03-20', 'Completada', 330.00), 
('XYZ789', 3, '2024-04-05', '2024-04-12', 'Cancelada', 400.00),  
('MNO456', 4, '2024-05-01', '2024-05-10', 'Completada', 200.00), 
('JKL012', 2, '2024-06-01', '2024-06-07', 'Cancelada', 490.00),  
('DEF345', 1, '2024-07-01', '2024-07-05', 'Completada', 325.00), 
('ABC123', 3, '2024-08-01', '2024-08-15', 'Completada', 450.00), 
('XYZ789', 4, '2024-09-01', '2024-09-10', 'Cancelada', 500.00),  
('MNO456', 1, '2024-10-01', '2024-10-07', 'Completada', 140.00), 
('JKL012', 4, '2024-11-01', '2024-11-15', 'Activa', 1050.00),   
('DEF345', 2, '2024-12-01', '2024-12-10', 'Pendiente', 650.00);






DELIMITER ;









