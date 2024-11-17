"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const users_tokens_controller_1 = require("../controllers/users_tokens.controller");
const router = (0, express_1.Router)();
router.get('/', users_controller_1.getUsers);
router.get('/:id', users_controller_1.getUser);
router.delete('/:id', users_controller_1.deleteUser);
router.post('/logout', users_tokens_controller_1.deleteTokens);
router.post('/', users_controller_1.postUser);
router.post('/login', users_controller_1.verifyUserCredentials, users_tokens_controller_1.generateToken);
router.put('/:id', users_controller_1.putUser);
router.post('/validate-token', users_tokens_controller_1.validate_token);
exports.default = router;
