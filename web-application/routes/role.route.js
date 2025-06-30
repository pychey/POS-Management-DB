import { Router } from "express";
import { createRole, deleteRole, getRole } from "../controllers/role.controller.js";

const roleRouter = Router();

roleRouter.get('/', getRole);
roleRouter.post('/', createRole);
roleRouter.delete('/:roleName', deleteRole);

export default roleRouter;