import { Router } from "express";
import { deleteBookings, getBooking, getBookings, postBookings, putCancelBookings, putModifyBookings } from "../controllers/bookings.controller";

const router = Router();

router.get('/', getBookings);
router.get('/:id', getBooking);
router.delete('/:id', deleteBookings);
router.post('/', postBookings);
router.put('/:id', putCancelBookings);
router.put('/modify/:id', putModifyBookings);

export default router;