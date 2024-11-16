"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = __importDefault(require("../routes/users.routes"));
const connection_1 = __importDefault(require("../db/connection"));
const cars_routes_1 = __importDefault(require("../routes/cars.routes"));
const bookings_routes_1 = __importDefault(require("../routes/bookings.routes"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '4000';
        this.middlewares();
        this.routes();
        this.conectDB();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Aplicacion corriendo por el puerto: ", this.port);
        });
    }
    middlewares() {
        //Parseo del JSON - para que cuando se recibe un json lo convierta a objeto
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use('/api/users', users_routes_1.default),
            this.app.use('/api/cars', cars_routes_1.default),
            this.app.use('/api/bookings', bookings_routes_1.default);
    }
    conectDB() {
        connection_1.default.connect((error) => {
            if (error)
                throw error;
            console.log('succesfull database conection');
        });
    }
}
exports.default = Server;
