"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cars_controller_1 = require("../controllers/cars.controller");
const router = (0, express_1.Router)();
router.get('/', cars_controller_1.getCars);
router.get('/:id', cars_controller_1.getCar);
router.delete('/:id', cars_controller_1.deleteCar);
router.post('/available', cars_controller_1.availableCar);
router.post('/', cars_controller_1.postCar);
router.put('/:id', cars_controller_1.putCar);
exports.default = router;
