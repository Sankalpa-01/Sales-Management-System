const dotenv = require('dotenv');
dotenv.config(); 

const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

// Attempt to connect to MySQL and then start the server
db.getConnection()
  .then((connection) => {
    console.log('✅ Connected to MySQL Database');
    connection.release(); // Release the connection back to the pool

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message || err);
    process.exit(1); // Exit process with failure
  });
