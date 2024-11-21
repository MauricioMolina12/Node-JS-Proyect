import { Router } from "express";
import { availableCar, deleteCar, getCar, getCars, postCar, putCar } from "../controllers/cars.controller";

const router = Router();

router.get('/', getCars);
router.get('/:id', getCar);
router.delete('/:id', deleteCar);
router.post('/available', availableCar);
router.post('/', postCar);
router.put('/:id', putCar);


export default router;