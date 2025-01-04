-- FUNCIONES Y PROCEDIMIENTOS Y TRIGGER

DELIMITER // 
CREATE FUNCTION total_price (d_start DATE, d_end DATE, l_plate VARCHAR(6))
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
   DECLARE total DECIMAL(10, 2);
   DECLARE fee DECIMAL(10, 2);
   DECLARE days INT;
    
   SELECT c.daily_fee INTO fee
   FROM  Cars c
   WHERE c.license_plate = l_plate;
    
   SET days = TIMESTAMPDIFF(DAY, d_start, d_end);
   SET total = fee * (days + 1);
    
   RETURN total;
END //

DELIMITER ;

SELECT total_price('2024-10-10', '2024-10-15', 'MNO456'); -- 6 days * $70 = $420


DELIMITER //
CREATE PROCEDURE booking_cust (IN id_cust INT)
BEGIN
   
   SELECT * FROM bookings_customers WHERE id_cliente = id_cust;
    
END //

DELIMITER ;





DELIMITER //
CREATE FUNCTION isitavailable (d_start DATE, d_end DATE, id_car VARCHAR(6))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
   DECLARE overlapping INT;
    
   SELECT COUNT(*) INTO overlapping
   FROM Bookings b
   WHERE b.l_plate = id_car
   AND b.b_status <> "Cancelada"
   AND (
      (d_start <= b.end_date AND d_end >= b.start_date)
   );
    
   IF overlapping = 0 THEN
      RETURN TRUE;
   ELSE
      RETURN FALSE;
   END IF;
    
END //

DELIMITER ;


SELECT isitavailable('2024-09-19', '2024-10-08', 'MNO456');



DELIMITER //
CREATE PROCEDURE make_a_booking (IN d_start DATE, IN d_end DATE, IN id_car VARCHAR(6), id_c INT)
BEGIN
	DECLARE avali BOOLEAN;
   DECLARE aux DATE;
   DECLARE role_u VARCHAR(100);
   
   SELECT r.role_name INTO role_u
	FROM Users u
	JOIN Roles r ON r.role_id = u.role_id 
	WHERE id_c = u.id;
    
   IF d_start > d_end THEN
      SET aux = d_start;
      SET d_start = d_end;
      SET d_end = aux;
   END IF;
    
   SET avali = isitavailable(d_start, d_end, id_car);
    
   IF avali = 1 THEN
   	IF role_u = "Cliente" THEN
   		INSERT INTO Bookings (l_plate, c_id, start_date, end_date, b_status, total_cost)
      	VALUES (id_car, id_c, d_start, d_end, "Pendiente", total_price(d_start, d_end, id_car));
      	SIGNAL SQLSTATE '01000' SET MESSAGE_TEXT = 'Booking successful';
      ELSE 
      	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'You is not a Costumer';
      END IF;
   ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This car is busy those days';
   END IF;

END //

DELIMITER ;

CALL make_a_booking('2024-12-15', '2024-12-21', 'JKL012', 2);






DELIMITER //
CREATE PROCEDURE cancel_booking (IN id_book INT, IN id_cus INT)
BEGIN
	
	DECLARE role_u VARCHAR(100);
	DECLARE cust INT;
	DECLARE statu VARCHAR(100);
	
	
	SELECT r.role_name INTO role_u  -- ver si el que esta haciendo la peticion es admin
	FROM Users u
	JOIN Roles r ON r.role_id = u.role_id 
	WHERE u.id = id_cus;
	
	SELECT b.c_id, b.b_status INTO cust, statu			-- ver si el que esta haciendo la peticion es el que hizo la reserva y el estado
	FROM Bookings b
	WHERE b.id = id_book;
	
	IF statu = "Pendiente" THEN
		IF cust = id_cus OR role_u = "Administrador" THEN -- lo puede hacer el cliente que hizo la reserva o el admin
	   	UPDATE Bookings AS b
	   	SET b.b_status = "Cancelada"
	   	WHERE b.id = id_book;
	   ELSE
	   	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'You are not an admin';
	   END IF;
	ELSE 
		SET statu = CONCAT('The booking has already been ', statu);
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = statu;
   END IF;
END //

DELIMITER ;







DELIMITER // 
CREATE PROCEDURE update_booking_price (IN id_ad INT, IN id_b INT, IN d_start DATE, IN d_end DATE, IN id_car VARCHAR(6))
BEGIN

	DECLARE role_u VARCHAR(100);
	DECLARE statu VARCHAR(100);
	
	SELECT r.role_name INTO role_u
	FROM Users u
	JOIN Roles r ON r.role_id = u.role_id 
	WHERE u.id = id_ad;
	
	SELECT b.b_status INTO statu		
	FROM Bookings b
	WHERE b.id = id_b;
	
	IF statu = "Pendiente" THEN
		IF role_u = "Administrador" THEN
			CALL cancel_booking(id_b, id_ad);
		   IF isitavailable(d_start, d_end, id_car) = 1 THEN
		   	UPDATE Bookings b
		   	SET b.total_cost = total_price(d_start, d_end, id_car),
		   		 b.start_date = d_start,
		   		 b.end_date = d_end,
		   		 b.l_plate = id_car,
		   		 b.b_status = "Pendiente"
		   	WHERE b.id = id_b;
		   ELSE
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This car is busy those days';
			END IF;	
	   ELSE
	      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'You are not an admin';
	   END IF;
	ELSE 
		SET statu = CONCAT('The booking has already been ', statu);
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = statu;
   END IF;

END //

DELIMITER ;



DELIMITER //


CREATE TRIGGER after_update_booking
AFTER UPDATE ON Bookings
FOR EACH ROW
BEGIN

	DECLARE changes TEXT DEFAULT '';

    -- Compara cada columna para detectar cambios y registrar los detalles
    IF OLD.l_plate <> NEW.l_plate THEN
        SET changes = CONCAT(changes, 'l_plate cambiado de "', OLD.l_plate, '" a "', NEW.l_plate, '"; ');
    END IF;

    IF OLD.start_date <> NEW.start_date THEN
        SET changes = CONCAT(changes, 'start_date cambiado de "', OLD.start_date, '" a "', NEW.start_date, '"; ');
    END IF;

    IF OLD.end_date <> NEW.end_date THEN
        SET changes = CONCAT(changes, 'end_date cambiado de "', OLD.end_date, '" a "', NEW.end_date, '"; ');
    END IF;

    IF OLD.b_status <> NEW.b_status THEN
        SET changes = CONCAT(changes, 'b_status cambiado de "', OLD.b_status, '" a "', NEW.b_status, '"; ');
    END IF;

    IF OLD.total_cost <> NEW.total_cost THEN
        SET changes = CONCAT(changes, 'total_cost cambiado de "', OLD.total_cost, '" a "', NEW.total_cost, '"; ');
    END IF;

    -- Si hay algún cambio, inserta un registro en BookingsAudit
    IF changes <> '' THEN
	    INSERT INTO BookingsAudit (
	        booking_id, l_plate, c_id, start_date, end_date, b_status, total_cost, change_details
	    )
	    VALUES (
	        OLD.id, OLD.l_plate, OLD.c_id, OLD.start_date, OLD.end_date, OLD.b_status, OLD.total_cost, changes
	    );
	 END IF;
END//













