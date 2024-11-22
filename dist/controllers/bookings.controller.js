"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateCarBusy = exports.putModifyBookings = exports.putCancelBookings = exports.postBookings = exports.deleteBookings = exports.getBookings = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const users_tokens_controller_1 = require("./users_tokens.controller");
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield (0, users_tokens_controller_1.id_token)(req.params.token);
    connection_1.default.query('SELECT role_id FROM Users WHERE id = ?', [userId], (error, data) => {
        var _a;
        if (error)
            throw error;
        if (((_a = data[0]) === null || _a === void 0 ? void 0 : _a.role_id) === 4) {
            connection_1.default.query('SELECT * FROM bookings_customers WHERE id_cliente = ?', [userId], ((error, data) => {
                if (error)
                    throw error;
                res.json(data);
            }));
        }
        else {
            connection_1.default.query('SELECT * FROM bookings_customers;', ((error, data) => {
                if (error)
                    throw error;
                res.json(data);
            }));
        }
    });
});
exports.getBookings = getBookings;
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
const postBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { d_start, d_end, id_car, token } = req.body;
    const userId = yield (0, users_tokens_controller_1.id_token)(token);
    connection_1.default.query('CALL make_a_booking(?, ?, ?, ?)', [d_start, d_end, id_car, userId], ((error, data) => {
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
});
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
const dateCarBusy = (req, res) => {
    const { id_car } = req.params;
    connection_1.default.query('SELECT start_date, end_date FROM Bookings WHERE l_plate = ?', [id_car], ((error, data) => {
        if (error)
            throw error;
        res.json({
            data
        });
    }));
};
exports.dateCarBusy = dateCarBusy;
