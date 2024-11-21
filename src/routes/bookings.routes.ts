import { Router } from "express";
import { deleteBookings, getBookings, postBookings, putCancelBookings, putModifyBookings } from "../controllers/bookings.controller";

const router = Router();

router.get('/:token', getBookings);
router.delete('/:id', deleteBookings);
router.post('/', postBookings);
router.put('/:id', putCancelBookings);
router.put('/modify/:id', putModifyBookings);

export default router;