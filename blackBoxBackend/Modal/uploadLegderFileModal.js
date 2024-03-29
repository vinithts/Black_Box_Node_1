const { json } = require("body-parser");
const { pool } = require("../Configiration/Config");
const { format } = require("mysql2");

const uploadLegderFileModal = async (ledgerData) => {
  const sql = `INSERT INTO ledgerDataTable(Portfolio_Name,Leg_ID,Exchange,Exchange_Symbol,Product,Order_Type,Order_ID,Time,Txn,Qty,Filled_Qty,Exchg_Time,Avg_Price,Status,Limit_Price,Order_Failed,User_ID,User_Alias,Remarks,Tag,Bsmtm,Netpl,tradeFileId)
     VALUES ?`;

  function parseCustomDate(dateStr) {
    const dateComponents = dateStr.match(
      /(\d+)-([A-Za-z]+)-(\d+) (\d+)\.(\d+)\.(\d+)/
    );

    if (!dateComponents) {
      return null;
    }

    const monthAbbreviations = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const year = parseInt(dateComponents[3], 10);
    const month = monthAbbreviations[dateComponents[2]];
    const day = parseInt(dateComponents[1], 10);
    const hours = parseInt(dateComponents[4], 10);
    const minutes = parseInt(dateComponents[5], 10);
    const seconds = parseInt(dateComponents[6], 10);

    const formattedDate = new Date(year, month, day, hours, minutes, seconds);

    const yyyy = formattedDate.getFullYear();
    const mm = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(formattedDate.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  function formatString(input) {
    if (input === undefined) {
      return "";
    }
    return input.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  }
  const values = ledgerData.map((e) => [
    e["Portfolio Name"],
    e["Leg ID"],
    e["Exchange"],
    e["Exchange Symbol"],
    e["Product"],
    e["Order Type"],
    e["Order ID"],
    parseCustomDate(format(e["Time"], "yyyy-MM-dd")),
    e["Txn"],
    e["Qty"],
    e["Filled Qty"],
    e["Exchg Time"],
    e["Avg Price"],
    e["Status"],
    e["Limit Price"],
    e["Order Failed"],
    e["User ID"],
    e["User Alias"],
    e["Remarks"],
    //  e["Tag"],
    e["TAG"],

    e["B/S MTM"].toString(),
    e["NETP&L"].toString(),
    e["tradeFileId"],
  ]);

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(sql, [values]);
    connection.release();

    return result, { message: "success" };
  } catch (e) {
    console.log(e);
  }
};

const getUploadFilesLedgerModal = async (fromDate, toDate) => {
  let sql = `SELECT * FROM ledgerDataTable `;
  let sql2 = `select distinct User_ID from ledgerdatatable `;

  if (fromDate === "" && toDate === "") {
    return sql;
  }
  if (fromDate && toDate) {
    sql += ` WHERE Time >='${fromDate}' AND Time<='${toDate}' `;
    sql2 += ` WHERE Time >='${fromDate}' AND Time<='${toDate}' `;
  }
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(sql);
    const [result2] = await connection.query(sql2);
    return { ledgerData: result, userList: result2.map((e) => e.User_ID) };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const tradeFileUploadModal = async (file, originalName) => {
  const insertSql = `INSERT INTO black_box.tradedata (tradeFIle,originalName) VALUES('${file}', '${originalName}');`;
  const selectSql = `SELECT * FROM black_box.tradedata WHERE tradeFile = ?;`;
  if (!file) {
    throw new Error("file is missing");
  }
  try {
    const connection = await pool.getConnection();
    await connection.query(insertSql);
    const [result] = await connection.query(selectSql, [file]);
    return result[0];
  } catch (e) {
    return e;
  }
};
const deleteTradeFileModal = async (id) => {
  const deleteTradeDataSql = `DELETE FROM black_box.ledgerdatatable WHERE tradeFileId = ?;`;
  const deleteFileSql = `DELETE FROM black_box.tradedata WHERE id = ?;`;

  const connection = await pool.getConnection();
  if (!id) {
    throw new Error("Id is missing");
  } else {
    try {
      await connection.query(deleteTradeDataSql, [id]);
      await connection.query(deleteFileSql, [id]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
};
const deleteTradeDataModal = async (id) => {
  const deleteTradeDataSql = `DELETE FROM black_box.ledgerdatatable WHERE id = ?;`;
  const connection = await pool.getConnection();
  if (!id) {
    throw new Error("Id is missing");
  }
  try {
    await connection.query(deleteTradeDataSql, [id]);
    return true;
  } catch (e) {
    console.log(e);
  }
};
const getLedgerDataByFileIdModal = async (id) => {
  const getTradeDataSql = `SELECT * FROM black_box.ledgerdatatable WHERE tradeFileId = ? ;`;
  const connection = await pool.getConnection();
  if (!id) {
    throw new Error("Id is missing");
  }
  try {
    const [result] = await connection.query(getTradeDataSql, [id]);
    if (result.length) {
      return result;
    } else {
      return { message: "Data Not found" };
    }
  } catch (e) {
    console.log(e);
  }
};
const getTradeFilesModal = async () => {
  const getTradeDataSql = `SELECT * FROM black_box.tradedata;`;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(getTradeDataSql);
    if (result.length) {
      return result;
    } else {
      return { message: "Data Not found" };
    }
  } catch (e) {
    console.log(e);
  }
};
const getTagNamesModal = async (id, fromDate, toDate) => {
  let getTradeDataSql = `select distinct Tag from ledgerdatatable where User_ID = '${id}'`;
  if (fromDate === "" && toDate === "") {
    getTradeDataSql;
  } else if (fromDate && toDate === "") {
    getTradeDataSql += ` && Time >='${fromDate}';`;
  } else if (fromDate === "" && toDate === "") {
    getTradeDataSql += ` && Time<='${toDate}';`;
  } else if (fromDate && toDate) {
    getTradeDataSql += ` && Time >='${fromDate}' && Time<='${toDate}' `;
  }
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(getTradeDataSql);

    return { tags: result.map((e) => e.Tag) };
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  uploadLegderFileModal,
  getUploadFilesLedgerModal,
  tradeFileUploadModal,
  deleteTradeFileModal,
  getLedgerDataByFileIdModal,
  getTradeFilesModal,
  deleteTradeDataModal,
  getTagNamesModal,
};
