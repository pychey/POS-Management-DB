import { Router } from "express";
import { testUserConnection, testUserOperation } from "../controllers/test.controller.js";

const testRouter = Router();

testRouter.post('/connection', testUserConnection);
testRouter.post('/operation', testUserOperation);

export default testRouter;