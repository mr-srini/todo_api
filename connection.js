import mysql from "mysql2";
import dotenvConfigOptions from "dotenv";

dotenvConfigOptions.config();

const databaseConnection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});


databaseConnection.connect((error, result) => {
  if (error) console.log(error);
  else console.log(`CONNECTED TO DB`);
});

export default databaseConnection;
