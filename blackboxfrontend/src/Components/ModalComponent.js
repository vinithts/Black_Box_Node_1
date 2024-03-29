import { Box, Button, Card, Grid, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import InputComponent from "./InputComponent";
import DropDown from "./DropDown";
import { instance } from "../Api";
import DatePickerComponent from "./DatePickerComponent";
import { toast } from "react-toastify";
// import { getCustomersDetails } from "./Accordion";

const ModalComponent = ({ open, handleClose }) => {
  const cardStyle = {
    width: "50%",
    height: "63vh",
    background: "#25242D",
    borderRadius: "10px",
    position: "absolute",
    top: "30%",
    left: "25%",
    transform: "translate(-50% -50%)",
    "@media (max-width: 768px)": {
      width: "95%",
      height: "63vh",
      position: "absolute",
      top: "30%",
      left: "2%",
      transform: "none",
    },
    "@media (max-width: 480px)": {
      width: "95%",
      height: "63vh",
      position: "absolute",
      top: "30%",
      left: "2%",
      transform: "none",
    },
  };

  const [dataObject, setDataObject] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    user_id: "",
    amt: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataObject({ ...dataObject, [name]: value });
  };
  // console.log(dataObject);
  const createCustomers = async () => {
    try {
      await instance.post(
        `/api/createCustomer`,

        dataObject,

        { headers: { "Content-Type": "application/json" } }
      );
      // getCustomersDetails();
      toast.success("Customer Created Successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      handleClose();
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };
  const gender = ["Male", "Female"];

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Card sx={cardStyle}>
          <Box
            sx={{
              padding: "20px",
              borderBottom: "1px solid gray",
            }}
          >
            <Typography variant="h5" sx={{ color: "white" }}>
              Add Customer
            </Typography>
          </Box>
          {/* <br /> */}
          <Box sx={{ padding: "18px" }}>
            <Grid container spacing={2}>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputComponent
                  label={"Name"}
                  name={"name"}
                  value={dataObject.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputComponent
                  label={"User ID"}
                  name={"user_id"}
                  value={dataObject.user_id}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputComponent
                  label={"Email"}
                  name={"email"}
                  value={dataObject.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputComponent
                  label={"Mobile"}
                  name={"mobile"}
                  value={dataObject.mobile}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <DropDown
                  label={"Gender"}
                  name={"gender"}
                  arr={gender}
                  value={dataObject.gender}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <DatePickerComponent
                  label={"Date of birth"}
                  name={"dob"}
                  value={dataObject.dob}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputComponent
                  label={"Address"}
                  name={"address"}
                  value={dataObject.address}
                  onChange={handleChange}
                  // textArea
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputComponent
                  label={"Amount"}
                  name={"amt"}
                  value={dataObject.amt}
                  onChange={handleChange}
                  // textArea
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ width: "100%", padding: "10px" }}>
            <Button
              onClick={createCustomers}
              variant="contained"
              sx={{
                float: "right",
                background: "white",
                color: "black",
                fontWeight: "600",
                "&:hover": {
                  background: "white",
                },
              }}
            >
              Create
            </Button>
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default ModalComponent;
