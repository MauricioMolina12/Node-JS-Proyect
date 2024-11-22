import { Router } from "express";
import { dateCarBusy, deleteBookings, getBookings, postBookings, putCancelBookings, putModifyBookings } from "../controllers/bookings.controller";

const router = Router();

router.get('/:token', getBookings);
router.get('/datebusy/:id_car', dateCarBusy);
router.delete('/:id', deleteBookings);
router.post('/', postBookings);
router.put('/:id', putCancelBookings);
router.put('/modify/:id', putModifyBookings);

export default router;