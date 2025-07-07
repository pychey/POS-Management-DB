import { Router } from "express";
import { getPrivilegeForRole, getPrivilegeForUser, grantPrivilegeToRole } from "../controllers/privilege.controller.js";

const privilegeRouter = Router();

privilegeRouter.get('/:role', getPrivilegeForRole);
privilegeRouter.get('/user/:username/:host', getPrivilegeForUser);
privilegeRouter.post('/', grantPrivilegeToRole);

export default privilegeRouter;