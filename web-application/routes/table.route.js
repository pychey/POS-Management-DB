import { Router } from "express";
import { getTables } from "../controllers/table.controller.js";

const tableRouter = Router();

tableRouter.get('/', getTables);

export default tableRouter;