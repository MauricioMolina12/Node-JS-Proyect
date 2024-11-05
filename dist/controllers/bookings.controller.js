"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putModifyBookings = exports.putCancelBookings = exports.postBookings = exports.deleteBookings = exports.getBooking = exports.getBookings = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getBookings = (req, res) => {
    connection_1.default.query('SELECT * FROM Bookings', ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
};
exports.getBookings = getBookings;
const getBooking = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('SELECT * FROM Bookings WHERE id = ?', id, ((error, data) => {
        if (error)
            throw error;
        res.json(data[0]);
    }));
};
exports.getBooking = getBooking;
const deleteBookings = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('DELETE FROM Bookings WHERE id = ?', id, ((error, data) => {
        if (error)
            throw error;
        res.json({
            msg: "successfull booking delete",
            id: id,
        });
    }));
};
exports.deleteBookings = deleteBookings;
const postBookings = (req, res) => {
    const { d_start, d_end, id_car, id_cos } = req.body;
    connection_1.default.query('CALL make_a_booking(?, ?, ?, ?)', [d_start, d_end, id_car, id_cos], ((error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            });
        }
        ;
        res.json({
            msg: "successfull booking insert",
            data: data
        });
    }));
};
exports.postBookings = postBookings;
const putCancelBookings = (req, res) => {
    const { id } = req.params;
    const { customer } = req.body;
    connection_1.default.query('CALL cancel_booking(?, ?)', [id, customer], ((error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            });
        }
        ;
        res.json({
            msg: "successfull booking cancelled",
            data: data
        });
    }));
};
exports.putCancelBookings = putCancelBookings;
const putModifyBookings = (req, res) => {
    const { id_user, d_start, d_end, id_car } = req.body;
    const { id } = req.params;
    connection_1.default.query('CALL update_booking_price(?, ?, ?, ?, ?)', [id_user, id, d_start, d_end, id_car], ((error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            });
        }
        ;
        res.json({
            msg: "successfull booking modify",
            data: data
        });
    }));
};
exports.putModifyBookings = putModifyBookings;
