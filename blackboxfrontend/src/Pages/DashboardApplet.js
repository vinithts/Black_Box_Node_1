import React, { useEffect, useState } from "react";
import AppletCard from "../Components/AppletCard";
import { Grid } from "@mui/material";
import { instance } from "../Api";
import { getCustomersDetails } from "../Components/Accordion";
import { toast } from "react-toastify";

const DashboardApplet = () => {
  const [PortfolioDetails, setPortfolioDetails] = useState([]);
  const [userId, setUserId] = useState([]);
  const [cusDetails, setCusDetails] = useState([]);
  const TotalPortfolioDetails = async () => {
    try {
      const response = await instance.get(
        `/api/getUploadFilesLedger?fromDate=${""}&toDate=${""}`
      );
      if (response.status === 200) {
        const port = response.data?.ledgerData.map((e) => e.Portfolio_Name);

        setPortfolioDetails(port.length);
        // const user = response.data?.map((e) => e.User_ID);
        // setUserId(user.length);
        const uniqueUserIds = [...new Set(response.data?.ledgerData.map((e) => e.User_ID))];
        setUserId(uniqueUserIds.length);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };
  useEffect((e) => {
    TotalPortfolioDetails();
    getCustomersDetails().then((res) => {

      const result = res.data
        .map((e) => Number(e.AMT))
        .reduce((a, c) => c + a, 0);

      setCusDetails(result);
    });
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
          <AppletCard one title={"Portfolio"} value={PortfolioDetails} />
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
          <AppletCard two title={"Users"} value={userId} />
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
          <AppletCard three title={"Amount"} value={cusDetails} />
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardApplet;
