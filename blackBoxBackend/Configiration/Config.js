const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
  host: "localhost",
  user: "vinith",
  password: "Vinith@123",
  database: "black_box",
  waitForConnections: true,
  connectionLimit: Infinity,
  queueLimit: 0,
});
(async () => {
  const connection = await pool.getConnection();
  try {
    let loginUser = `CREATE TABLE IF NOT EXISTS loginUser(id INT NOT NULL AUTO_INCREMENT,userName varchar(256)NOT NULL,passwordData varchar(256)NOT NULL,PRIMARY KEY(id))`;
    let tradeFileData = `CREATE TABLE IF NOT EXISTS 
    tradedata(
      id INT NOT NULL AUTO_INCREMENT,
      tradeFIle varchar(256)NOT NULL,
      originalName varchar(256)NOT NULL,
      PRIMARY KEY(id))`;

    let customersTable = `CREATE TABLE IF NOT EXISTS customers(id int NOT NULL AUTO_INCREMENT,
    name varchar(256) NOT NULL ,
    email varchar(256) NOT NULL,
    mobile varchar(256) NOT NULL,
    gender varchar(256)NOT NULL,
    dateOfBirth varchar(256) NOT NULL,
    address varchar(256) NOT NULL,
    User_Id  varchar(256) NOT NULL,
    AMT varchar(256) NOT NULL,
    brokerName varchar(256) NOT NULL,
    status varchar(256) NOT NULL,
    PRIMARY KEY(id)
      )`;

    let ledgerData = `CREATE TABLE IF NOT EXISTS ledgerDataTable (
      id int NOT NULL AUTO_INCREMENT,
      Tag varchar(256),
      Leg_ID varchar(256),
      Exchange varchar(256),
      Exchange_Symbol varchar(256),
      Product varchar(256),
      Order_Type varchar(256),
      Order_ID varchar(256),
      Time varchar(256),
      Txn varchar(256),
      Qty varchar(256),
      Filled_Qty varchar(256),
      Exchg_Time varchar(256),
      Avg_Price varchar(256),
      Status varchar(256),
      Limit_Price varchar(256),
      Order_Failed varchar(256),
      User_ID varchar(256),
      User_Alias varchar(256),
      Remarks varchar(256),
      Portfolio_Name varchar(256),
      Bsmtm varchar(256),
      Netpl varchar(256),
      tradeFileId int NOT NULL,
      PRIMARY KEY (id),
      KEY tradeFileId_idx (tradeFileId),
      CONSTRAINT tradeFileId FOREIGN KEY (tradeFileId) REFERENCES tradedata (id)
  );`;
    let TestingImageUploads = `CREATE TABLE IF NOT EXISTS images(id INT NOT NULL AUTO_INCREMENT ,ImagesData VARCHAR(512)NOT NULL,Sno varchar(256), PRIMARY KEY(id))`;
    await connection.query(TestingImageUploads);
    await connection.query(customersTable);
 
    await connection.query(loginUser);
    await connection.query(tradeFileData);
       await connection.query(ledgerData);
    const [row] = await connection.query("SELECT * FROM loginUser");
    if (row.length === 0) {
      await connection.query(
        `INSERT INTO loginUser (userName,passwordData)VALUES('tsvinith@gmail.com','123456')`
      );
      console.log("loginUser table  data is inserted !");
    }
    console.log("Table created successfully !");
  } catch (e) {
    console.log("table error", e);
  }
})();

module.exports = { pool };
