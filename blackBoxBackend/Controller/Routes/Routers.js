const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const CustomersControler = require("../CustomersControler");
const uploadLegderFileController = require("../LedgerController");
const { loginUserDataController } = require("../LoginController");
const {
  TestingImageUploadsController,
  UpdateImageUpload,
} = require("../TestingImageUploadContoller");

const uploadImages = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});
const upload = multer({ storage: uploadImages });
const uploadCSV = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads/tradeData");
  },
  filename: (req, file, callBack) => {
    callBack(null, "tradeData" + "-" + Date.now() + "-" + file.originalname);
  },
});
const uploadTradeData = multer({ storage: uploadCSV });

const router = express.Router();
router.post(`/images`, upload.single("file"), TestingImageUploadsController);
router.get(`/login`, loginUserDataController);
// -------
router.post(`/createCustomer`, CustomersControler.CustomersControler);
router.put(`/updateStatus`, CustomersControler.setCustomerStatus);
router.get("/getCustomersDetails", CustomersControler.getCustomersController);
router.put(
  "/updateCustomersDetails/:id",
  CustomersControler.updateCustomerDetails
);
router.get("/protfolioName/:tag", CustomersControler.getPortfolioName);
router.post(
  "/uploadFilesLedger",

  uploadLegderFileController.uploadLegderController
);
router.post(
  "/TradeFile",
  uploadTradeData.single("file"),
  uploadLegderFileController.tradeFileUpload
);
router.get(
  "/getUploadFilesLedger",
  uploadLegderFileController.getUploadFilesLedgerController
);
router.get(
  "/ledgerDataByFile/:id",
  uploadLegderFileController.getLedgerDataByFileId
);
router.get("/TradeFiles", uploadLegderFileController.getTradeFiles);
router.get("/getTagsByUserId", uploadLegderFileController.getTagNamesByUserId);
router.delete("/TradeFile/:id", uploadLegderFileController.deleteTradeFile);
router.delete("/tradeData/:id", uploadLegderFileController.deleteTradeDataById);

module.exports = router;
