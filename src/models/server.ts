import express, {Application} from 'express';
import routesUsers from '../routes/users.routes';
import connection from '../db/connection';
import routesCars from '../routes/cars.routes';
import routesBookings from '../routes/bookings.routes';
import routesFavoritesCar from '../routes/favoritescar.routes';
import cors from 'cors';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '4000';
        this.middlewares();
        this.routes();
        this.conectDB();
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log("Aplicacion corriendo por el puerto: ", this.port)
        })
    }

    middlewares(){
        //Parseo del JSON - para que cuando se recibe un json lo convierta a objeto
        this.app.use(express.json());
        this.app.use(cors());
    }

    routes(){
        this.app.use('/api/users', routesUsers),
        this.app.use('/api/cars', routesCars),
        this.app.use('/api/bookings', routesBookings),
        this.app.use('/api/favoritesCars', routesFavoritesCar)
    }

    conectDB(){
        connection.connect((error) => {
            if(error) throw error;
            console.log('succesfull database conection')
        })
    }
}

export default Server;