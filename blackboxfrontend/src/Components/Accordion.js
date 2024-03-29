import {
  Box,
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { instance } from "../Api";
import DatePickerComponent from "./DatePickerComponent";
import DropDown from "./DropDown";
import { toast } from "react-toastify";
import Loading from "./Loading";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteIcon from "@mui/icons-material/Delete";

export async function getCustomersDetails() {
  try {
    const result = await instance.get(`/api/getCustomersDetails`);
    return result;
  } catch (e) {
    console.log("err", e);
    toast.error("Something Went to wrong  !", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
  }
}

const AccordionComponent = ({ title, trade }) => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [UserIDtype, setUserIDType] = useState("");
  const [tagType, setTagType] = useState("");

  const handleToDate = (e) => {
    setToDate(e.target.value);
  };
  const handleChange = (e) => {
    setTagType(e.target.value);
  };
  const [userId, setUserId] = useState([]);
  const [tags, setTags] = useState([]);

  const getUploadFilesLedger = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/api/getUploadFilesLedger?fromDate=${
          fromDate ? fromDate : ""
        }&toDate=${toDate ? toDate : ""}`
      );
      if (response.status === 200) {
        setData(response.data.ledgerData);
        setUserId(response.data.userList);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };
  useEffect(() => {
    if (data[0]) {
      setKeys(Object.keys(data[0]));
    }
  }, [data]);
  const handleFromDate = (e) => {
    setFromDate(e.target.value);
  };

  const filterDatasValue = (data) => {
    const fieldsToSearch = ["User_ID", "Tag"];
    if (UserIDtype === "All" || tagType === "All") {
      return data;
    } else {
      return fieldsToSearch?.some(
        (field) =>
          String(data[field])
            ?.toLowerCase()
            ?.includes(tagType?.toLowerCase() || UserIDtype.toLowerCase()) &&
            (!UserIDtype || data["User_ID"] === UserIDtype)
      );
    }
  };
  const filteredData = data?.filter((filData) => filterDatasValue(filData));
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [cusKey, setCusKey] = useState([]);
  const [cusDetails, setCusDetails] = useState([]);
  useEffect(() => {
    setLoading(true);
    getCustomersDetails()
      .then((res) => {
        if (res && res.status === 200) {
          setCusDetails(res.data);
          setCusKey(Object.keys(res.data[0]));
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const sellValue = useMemo(() => {
    return (
      filteredData
        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .reduce((acc, value) => {
          if (value["Txn"] === "BUY") {
            acc += Number(value["Avg_Price"]) * -Number(value["Qty"]);
          } else {
            acc += Number(value["Avg_Price"]) * Number(value["Qty"]);
          }
          return acc;
        }, 0)
    );
  }, [filteredData, page, rowsPerPage]);

  const getTagsByUserId = async (id) => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/api/getTagsByUserId?id=${id}&fromDate=${
          fromDate ? fromDate : ""
        }&toDate=${toDate ? toDate : ""}`
      );
      if (response.status === 200) {
        setTags(response.data.tags);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUploadFilesLedger();
    if (UserIDtype) {
      getTagsByUserId(UserIDtype);
    }
  }, [fromDate, toDate, page || rowsPerPage]);
  const arr = ["Portfolio_Name", "Order_ID", "User_ID"];
  return (
    <>
      {loading && <Loading />}

      <div style={{ padding: "15px" }}>
        {!trade ? (
          <Box sx={{ background: "#25242D" }}>
            <Card
              sx={{ width: "100%", background: "#25242D", padding: "15px" }}
            >
              <Typography
                sx={{ padding: "15px", color: "white", fontWeight: "600" }}
              >
                {" "}
                {title}
              </Typography>
              <Paper
                sx={{
                  overflow: "hidden",
                  border: "1px solid #D9D9D9",
                  // padding: "15px"
                }}
              >
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {cusKey.map((keys, index) => (
                          <TableCell
                            key={keys.id}
                            align={"center"}
                            style={{
                              minWidth: 170,
                              background: "#25242D",
                              color: "white",
                              fontWeight: "600",
                            }}
                          >
                            {keys.charAt(0).toUpperCase() + keys.slice(1)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cusDetails?.map((pair, i) => (
                        <TableRow key={i}>
                          {cusKey?.map((key, index) => (
                            <TableCell
                              sx={{ background: "#25242D", color: "white" }}
                              key={index}
                              align="center"
                              style={{ minWidth: 170 }}
                            >
                              {pair[key]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={12}
                  rowsPerPage={10}
                  page={10}
                  sx={{ background: "#25242D", color: "white" }}
                />
              </Paper>
            </Card>
          </Box>
        ) : (
          <>
            <Card
              sx={{ padding: "15px", width: "100%", background: "#25242D" }}
            >
              <Grid container spacing={2} p={2}>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DatePickerComponent
                    label={"From Date"}
                    name={"From Date"}
                    value={fromDate}
                    onChange={handleFromDate}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DatePickerComponent
                    label={"To Date"}
                    name={"To Date"}
                    value={toDate}
                    onChange={handleToDate}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DropDown
                    arrays={userId}
                    other
                    label={"User_ID"}
                    values={UserIDtype}
                    onChanges={(e) => {
                      setTagType("");
                      getTagsByUserId(e.target.value);
                      setUserIDType(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DropDown
                    disabled={!UserIDtype}
                    arr={tags}
                    label={"Portfolio"}
                    value={tagType}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
              </Grid>
              <Box sx={{ padding: "15px" }}>
                {!loading && data.length === 0 ? (
                  <Typography sx={{ color: "white",textAlign:"center" }}>
                    <ErrorOutlineIcon sx={{ color: "red" }} /> Need to Upload
                    file in settings!
                  </Typography>
                ) : (
                  <Paper
                    sx={{ overflow: "hidden", border: "1px solid #D9D9D9" }}
                  >
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {keys.map((item, index) => (
                              <TableCell
                                key={index}
                                sx={{
                                  background: "rgb(23, 23, 33)",
                                  color: "white",
                                  fontWeight: "600",
                                  textAlign: "center",
                                  // border: "1px solid white",
                                }}
                              >
                                {item}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((value, Rowindex) => {
                              return (
                                <TableRow key={Rowindex}>
                                  {keys.map((allData, Colindex) => (
                                    <TableCell
                                      align="center"
                                      key={Colindex}
                                      sx={{
                                        background: "#25242D",
                                        color: "white",
                                        textAlign: "center",
                                        // border: "1px solid white",
                                      }}
                                    >
                                      {allData === "Remarks"
                                        ? value.Remarks?.slice(0, 15)
                                        : allData === "Netpl"
                                        ? parseFloat(value[allData]).toFixed(2)
                                        : value[allData] !== null
                                        ? value[allData]
                                        : "--"}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ background: "#25242D", color: "white" }}
                    />
                    <div
                      style={{
                        padding: "10px",
                        background: "#25242D",
                        color: "white",
                      }}
                    >
                      <Typography
                        sx={{
                          paddingRight: "10rem",
                          color: "#90EE90",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {/* {`Total Profit :  ${Math.round(sellValue)}`} */}
                        Total Profit: {sellValue.toFixed(2)}
                        &nbsp;
                      </Typography>
                    </div>
                  </Paper>
                )}
              </Box>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AccordionComponent;
