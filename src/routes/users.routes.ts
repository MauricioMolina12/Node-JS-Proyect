import { Router } from "express";
import { getUser, getUsers, deleteUser, postUser, putUser, verifyUserCredentials } from "../controllers/users.controller";
import { deleteTokens, generateToken } from "../controllers/users_tokens.controller";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.post('/logout', deleteTokens)
router.post('/', postUser);
router.post('/login', verifyUserCredentials, generateToken);
router.put('/:id', putUser);


export default router;