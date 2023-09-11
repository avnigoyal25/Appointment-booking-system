const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost', // Change this to your MySQL host
  user: 'root',      // Change this to your MySQL username
  password: '',      // Change this to your MySQL password
  database: 'experiment', // Change this to your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((connection) => {
    console.log('Connected to the database');
    connection.release();
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

module.exports = pool;
