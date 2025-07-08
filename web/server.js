import express from "express";
import cors from "cors";
import userRouter from './routes/user.route.js';
import roleRouter from './routes/role.route.js';
import privilegeRouter from './routes/privilege.route.js'
import tableRouter from "./routes/table.route.js";
import testRouter from "./routes/test.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users/', userRouter);
app.use('/api/roles/', roleRouter);
app.use('/api/privileges/', privilegeRouter);
app.use('/api/tables/', tableRouter);
app.use('/api/test/', testRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(5001, () => {
    console.log(`Server running on http://localhost:5001`);
});