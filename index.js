const express = require('express');
const dotenv = require('dotenv');

const userRouter = require('./routes/user');
const activityTypeRouter = require('./routes/activityType');
// const clientConfig = require('./middlewares/clientConfig');
const Database = require('./database/Database');

dotenv.config({ path: './.env' });
const app = express();

// app.use(clientConfig);
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/activityType', activityTypeRouter);

async function start () {
  await Database.connect();
  
  const PORT = process.env.PORT || 4000; 
  app.listen(PORT, ()=>{ console.log(`server is listening on port ${PORT}`); });
} 


start();