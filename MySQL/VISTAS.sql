-- VISTAS

CREATE VIEW available_cars AS
SELECT c.license_plate, c.brand, c.model, c.car_type
FROM Cars c
WHERE isitavailable(CURDATE(), CURDATE(), c.license_plate) = TRUE;

SELECT * FROM available_cars;

DROP VIEW bookings_customers

CREATE VIEW bookings_customers AS
SELECT b.id AS id_booking, b.b_status,
		 u.id AS id_cliente, u.c_name AS nombre, 
		 b.start_date, b.end_date, 
		 c.brand, c.model, c.license_plate, c.image_path,
		 b.total_cost
FROM Bookings b
JOIN Users u ON b.c_id = u.id
JOIN Cars c ON b.l_plate = c.license_plate

SELECT * FROM bookings_customers;


CREATE VIEW income_from_vehicles AS
SELECT c.license_plate, c.brand, c.model, SUM(b.total_cost) AS total_ingresos
FROM Cars c
JOIN Bookings b ON c.license_plate = b.l_plate
WHERE b.b_status = "Confirmed"
GROUP BY c.license_plate;

SELECT * FROM income_from_vehicles;
