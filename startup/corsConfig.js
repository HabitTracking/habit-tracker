const cors = require('cors');

module.exports = (app)=>{
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }));
};
