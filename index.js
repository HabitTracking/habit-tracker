const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const Database = require('./database/Database');

dotenv.config({ path: './.env' });
const app = express();

app.use(express.json());
app.use('/api/user', userRouter);

async function start () {
  await Database.connect();
  
  const PORT = process.env.PORT || 4000; 
  app.listen(PORT, ()=>{ console.log(`server is listening on port ${PORT}`); });
} 


start();