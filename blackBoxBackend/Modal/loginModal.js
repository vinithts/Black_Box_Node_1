const { pool } = require("../Configiration/Config");

const loginUserDataModal = async (userData) => {
  const sql = `SELECT userName, passwordData FROM loginUser WHERE userName='${userData[0]}'`;

  try {
    const connection = await pool.getConnection();
    const result = await connection.query(sql);
    // connection.release();

    if (result[0][0]) {
      const storedPassword = result[0][0].passwordData;

      if (storedPassword === userData[1]) {
        return result;
      }
    }

    return false;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  loginUserDataModal,
};
