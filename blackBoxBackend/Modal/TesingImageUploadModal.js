const { pool } = require("../Configiration/Config");

const TestingImageUploadsModal = async (file) => {

    const sql = `insert into images(ImagesData) values(?)`;
    const connection = await pool.getConnection();
    if (!file) {
        throw new Error("file is missing")
    }
    try {
        const result = await connection.query(sql, [file]) 
        return result
    } catch (e) {
        console.log(e)
    }
}
module.exports = {
  TestingImageUploadsModal,
};