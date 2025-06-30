// server.js
import express from "express";
import cors from "cors";
import path from "path";
import userRouter from './routes/user.route.js';
import roleRouter from './routes/role.route.js';
import privilegeRouter from './routes/privilege.route.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users/', userRouter);
app.use('api/roles/', roleRouter);
app.use('api/privilege/', privilegeRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(5001, () => {
    console.log(`Server running on http://localhost:5001`);
});