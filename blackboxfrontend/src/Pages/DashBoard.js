import React, { useState } from "react";
import DashboardApplet from "./DashboardApplet";
import Trade from "./Trade";
import { ToastContainer } from "react-bootstrap";
import Charts from "../Components/Charts";
import { instance } from "../Api";

// ------------

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DashBoard = () => {
  const [getLedger, setGetLedger] = useState([]);
  const chartsValues = async () => {
    try {
      const response = await instance.get(
        `/api/getUploadFilesLedger?fromDate= &toDate= `
      );
      if (response.status === 200) {
        setGetLedger(response.data.ledgerData);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };

  useState(() => {
    chartsValues();
  }, []);
  // const filterUserId = getLedger.map((userId) => userId.User_ID);
  // const userIDset = new Set(filterUserId);
  // const uniqueId = [...userIDset];
  // console.log(uniqueId);

  const filterUserIdAvgValues = getLedger.map((data) => {
    if (data.User_ID) {
      return data.Avg_Price;
    }
  });

  const filterDistintValue = (data) => {
    const obj = {};
    for (const char of data) {
      if (obj[char.User_ID]) {
        if (char.Txn === "BUY") {
          obj[char.User_ID] += Number(char.Avg_Price) * -Number(char.Qty);
        } else {
          obj[char.User_ID] += Number(char.Avg_Price) * Number(char.Qty);
        }
      } else {
        if (char.Txn === "BUY") {
          obj[char.User_ID] = Number(char.Avg_Price) * -Number(char.Qty);
        } else {
          obj[char.User_ID] = Number(char.Avg_Price) * Number(char.Qty);
        }
      }
    }
    const keys = Object.keys(obj);
    const values = Object.values(obj);

    return [keys, values];
  };

  const result = filterDistintValue(getLedger);
  // console.log("result", result);
  console.log(result);

  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigate = useNavigate();
  const handleNav = (nav) => {
    navigate(nav);
  };

  return (
    <>
      <div>
        <br />
        <DashboardApplet />
        {/* <AddCustomer /> */}

        <br />
        <Trade />
        {getLedger.length > 0 ? (
          <Charts data1={filterUserIdAvgValues} downData1={result} />
        ) : null}
        <ToastContainer />
      </div>
    </>
  );
};

export default DashBoard;
