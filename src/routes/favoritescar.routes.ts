import { Router } from "express";
import { addFavoriteCar, delFavoriteCar, getUserFavorites } from "../controllers/favoritescar.controller";

const router = Router();

router.get('/:userId', getUserFavorites);
router.post('/', addFavoriteCar);
router.delete('/:licensePlate', delFavoriteCar);

export default router;