const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');

dotenv.config({ path: './.env' });
const app = express();

app.use(express.json());
app.use('/user', userRouter);

const PORT = process.env.PORT || 4000; 
app.listen(PORT, ()=>{ console.log(`server is listening on port ${PORT}`); });