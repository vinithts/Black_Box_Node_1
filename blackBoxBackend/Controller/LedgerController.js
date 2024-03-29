const path = require("path");
const xlsx = require("xlsx");
const { pool } = require("../Configiration/Config");
const {
  uploadLegderFileModal,
  getUploadFilesLedgerModal,
  tradeFileUploadModal,
  deleteTradeFileModal,
  getLedgerDataByFileIdModal,
  getTradeFilesModal,
  deleteTradeDataModal,
  getTagNamesModal,
} = require("../Modal/uploadLegderFileModal");

const uploadLegderController = async (req, res, next) => {
  try {
    const result = await uploadLegderFileModal(req.body.data);
    res.json(result);
    return { message: "success" };
  } catch (e) {
    console.log(e);
    next(e);
  }
};
const getUploadFilesLedgerController = async (req, res) => {
  const { fromDate, toDate } = req.query;

  try {
    let response;

    if (fromDate === "" && toDate === "") {
      response = await getUploadFilesLedgerModal(fromDate, toDate);
    }
    if (fromDate && toDate) {
      response = await getUploadFilesLedgerModal(fromDate, toDate);
    } else {
      response = await getUploadFilesLedgerModal();
    }
    return res.json(response);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const tradeFileUpload = async (req, res) => {
  const file = req.file;
  try {
    if (file) {
      const filePath = path.join("uploads/tradeData", file.filename);
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { cellDates: true });
      const selectSql = `SELECT * FROM black_box.tradedata WHERE originalName = '${file.originalname}' ;`;
      try {
        const [response] = await pool.query(selectSql); 
        if (!response.length) {
          const result = await tradeFileUploadModal(
            file.filename,
            file.originalname
          );
          await uploadLegderFileModal(
            jsonData.map((e) => ({ ...e, tradeFileId: result.id }))
          );
          return res.status(200).json({ message: "upload file successfully !" });
        } else {
          return res.status(400).json({ message: "file is already exist !" });
        }
      }
    
      catch (error) {
        console.error("Error executing SQL query:", error); 
      }

    } else {
      return res.status(400).json({ message: "file is missing !" });
    }
  } catch (e) {
    return res.status(500).json({ Error: e });
  }
};
const deleteTradeDataById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "Id is misssing" });
  } else {
    try {
      await deleteTradeDataModal(id);
      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: error });
    }
  }
};

const deleteTradeFile = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "file Id is misssing" });
  } else {
    try {
      await deleteTradeFileModal(id);
      res.status(200).json({ message: "delete file successfully !" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: error });
    }
  }
};
const getLedgerDataByFileId = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "file Id is misssing" });
  } else {
    try {
      const result = await getLedgerDataByFileIdModal(id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: error });
    }
  }
};
const getTradeFiles = async (req, res) => {
  try {
    const result = await getTradeFilesModal();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error });
  }
};

const getTagNamesByUserId = async (req, res) => {
  const { fromDate, toDate, id } = req.query;
  try {
    const result = await getTagNamesModal(id, fromDate, toDate);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error });
  }
};
module.exports = {
  uploadLegderController,
  getUploadFilesLedgerController,
  tradeFileUpload,
  deleteTradeFile,
  getLedgerDataByFileId,
  getTradeFiles,
  deleteTradeDataById,
  getTagNamesByUserId,
};
