import { Router } from "express";
import { getPrivilegeForRole, grantPrivilegeToRole } from "../controllers/privilege.controller.js";

const privilegeRouter = Router();

privilegeRouter.get('/:role', getPrivilegeForRole);
privilegeRouter.post('/', grantPrivilegeToRole);

export default privilegeRouter;