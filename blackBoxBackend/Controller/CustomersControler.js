const {
  CustomerModal,
  getCustomersModal,
  updateCustomerDetailsModal,
  getPortfolioNameByTag,
  setCustomerStatusModal,
} = require("../Modal/CustomerModal");
const CustomersControler = async (req, res, next) => {
  const {
    name,
    email,
    mobile,
    gender,
    dob,
    address,
    user_id,
    amt,
    brokerName,
    status,
  } = req.body;
  const customersData = [
    name,
    email,
    mobile,
    gender,
    dob,
    address,
    user_id,
    amt,
    brokerName,
    status,
  ];
  try {
    const result = await CustomerModal(customersData);
    res.json(result);
  } catch (e) {
    next(e);
  }
};
const getCustomersController = async (req, res) => {
  try {
    const response = await getCustomersModal();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const updateCustomerDetails = async (req, res, next) => {
  const cusID = req.params.id;
  const {
    name,
    email,
    mobile,
    gender,
    dob,
    address,
    user_id,
    amt,
    brokerName,
    status,
  } = req.body;
  const updateData = [
    name,
    email,
    mobile,
    gender,
    dob,
    address,
    user_id,
    amt,
    brokerName,
    status,
  ];

  try {
    const result = await updateCustomerDetailsModal(cusID, updateData);
    res.json(result);
  } catch (e) {
    console.log(e);
    next();
  }
};

const getPortfolioName = async (req, res) => {
  const tag = req.params.tag;
  try {
    const response = await getPortfolioNameByTag(tag);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};
const setCustomerStatus = async (req, res) => {
  const { status, id } = req.query;
  console.log(req.query);
  try {
    const response = await setCustomerStatusModal(status, id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};
module.exports = {
  CustomersControler,
  getCustomersController,
  updateCustomerDetails,
  getPortfolioName,
  setCustomerStatus,
};
