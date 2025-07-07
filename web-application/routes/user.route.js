import { Router } from "express";
import { createUser, deleteUser, getUsers, grantRoleToUser, updateUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.post('/:username/:host/grant-role', grantRoleToUser);
userRouter.put('/:username/:host/role', updateUser);
userRouter.delete('/:username/:host', deleteUser);

export default userRouter;