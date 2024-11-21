"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoritescar_controller_1 = require("../controllers/favoritescar.controller");
const router = (0, express_1.Router)();
router.get('/:userId', favoritescar_controller_1.getUserFavorites);
router.post('/', favoritescar_controller_1.addFavoriteCar);
router.delete('/:licensePlate', favoritescar_controller_1.delFavoriteCar);
exports.default = router;
