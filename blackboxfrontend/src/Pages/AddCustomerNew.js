import { Box, Button, Card, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import InputComponent from "../Components/InputComponent";
import DropDown from "../Components/DropDown";
import { instance } from "../Api";
import DatePickerComponent from "../Components/DatePickerComponent";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";

const AddCustomerNew = () => {
  const [data, setData] = useState([]);
  const [UserIDtype, setUserIDType] = useState("");
  const [dataObject, setDataObject] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    user_id: "",
    amt: "",
    brokerName:"",
    status:"Active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataObject({ ...dataObject, [name]: value });
  };

  const [loading, setLoading] = useState(false);

  const createCustomers = async () => {
    setLoading(true);

    // Validation checks
    if (!dataObject.name || 
        !dataObject.brokerName||
        !dataObject.email || 
        !dataObject.mobile ||
        !dataObject.address || 
        !dataObject.gender ||
        !dataObject.user_id ||
        !dataObject.dob ||
        !dataObject.amt) {
      toast.error("Please fill in all fields!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dataObject.email)) {
      toast.error("Please enter a valid email address!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(dataObject.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }

    // Amount validation
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(dataObject.amt)) {
      toast.error("Please enter a valid amount!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await instance.post(
        `/api/createCustomer`,
        { ...dataObject },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast.success("Customer Created Successfully !", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });

        setDataObject({
          name: "",
          brokerName:"",
          email: "",
          mobile: "",
          gender: "",
          dob: "",
          address: "",
          user_id: "",
          amt: "",
        });
        setUserIDType("");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    } finally {
      setLoading(false);
    }
  };

  const gender = ["Male", "Female"];

  const getUploadFilesLedger = async () => {
    try {
      const response = await instance.get(`/api/getUploadFilesLedger`);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };

  const filterDatasValue = (data) => {
    const fieldsToSearch = ["Portfolio_Name", "User_ID", "Tag"];
    return fieldsToSearch?.some((field) =>
      String(data[field])?.toLowerCase()?.includes(UserIDtype.toLowerCase())
    );
  };

  useEffect(() => {
    getUploadFilesLedger();
  }, []);
  return (
    <div>
      <Card sx={{display:'flex', background: "#25242D",margin:'20px'}}>
      <Box sx={{margin:"20px"}}>
       <Grid container spacing={2}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <InputComponent
                label={"Name"}
                name={"name"}
                value={dataObject.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <InputComponent
                label={"BrokerName"}
                name={"brokerName"}
                value={dataObject.brokerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <InputComponent
                label={"User_ID"}
                name={"user_id"}
                value={dataObject.user_id}
                onChange={handleChange}
              />
             </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <InputComponent
                label={"Email"}
                name={"email"}
                value={dataObject.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <InputComponent
                label={"Mobile"}
                name={"mobile"}
                value={dataObject.mobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <DropDown
                label={"Gender"}
                name={"gender"}
                arr={gender}
                value={dataObject.gender}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <DatePickerComponent
                label={"Date of birth"}
                name={"dob"}
                value={dataObject.dob}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <InputComponent
                label={"Amount"}
                name={"amt"}
                value={dataObject.amt}
                onChange={handleChange}
              />
             </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <InputComponent
                label={"Address"}
                name={"address"}
                value={dataObject.address}
                onChange={handleChange}
                // textArea
              />
            </Grid>
           
          </Grid>
          <Button
            onClick={createCustomers}
            variant="contained"
            sx={{
              marginTop:'10px',
              float:'right',
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
      {loading && <Loading />}
    </div>
  );
};

export default AddCustomerNew;
