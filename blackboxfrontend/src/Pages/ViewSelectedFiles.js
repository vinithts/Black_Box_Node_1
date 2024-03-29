import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";
import { instance } from "../Api";
import { Paper } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";

function ViewSelectedFiles() {
  const { id } = useParams();

  const getfiledetailsById = async (id) => {
    try {
      const result = await instance.get(`/api/ledgerDataByFile/${id}`);
      return result;
    } catch (e) {
      console.log("err", e);
      toast.error("Something Went to wrong  !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };

  const [cusKey, setCusKey] = useState([]);
  const [cusDetails, setCusDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const deleteFile = async (id) => {
    try {
      // Optimistic rendering: Update state before waiting for the API response
      const updatedCusDetails = cusDetails.filter((file) => file.id !== id);
      setCusDetails(updatedCusDetails);
  
      const response = await instance.delete(`/api/tradeData/${id}`);
      if (response.status === 200) {
        console.log("success");
        toast.success("Successfully Deleted");
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    setLoading(true);
    getfiledetailsById(id)
      .then((res) => {
        if (res && res.status === 200) {
          const modifiedData = res.data.map(({ tradeFileId, ...rest }) => rest);

          setCusDetails(modifiedData);
          setCusKey(Object.keys(modifiedData[0])); // Assuming modifiedData[0] is not null or undefined
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <Box sx={{ padding: "10px" }}>
          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            File Data's
          </Typography>
          {/* <Paper sx={{ overflow: "hidden", border: "1px solid #D9D9D9" }}> */}
          <TableContainer
            sx={{
              maxHeight: 600,
              marginTop: "4rem",
              border: "1px solid #D9D9D9",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      background: " rgb(23, 23, 33)",
                      color: "white",
                      fontWeight: "600",
                      textAlign: "center",
                      // border: "1px solid white",
                    }}
                  >
                    S.No
                  </TableCell>
                  {cusKey.map((keys, index) => (
                    <TableCell
                      key={keys.id}
                      sx={{
                        background: " rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                        // border: "1px solid white",
                      }}
                    >
                      {keys.charAt(0).toUpperCase() + keys.slice(1)}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      background: " rgb(23, 23, 33)",
                      color: "white",
                      fontWeight: "600",
                      textAlign: "center",
                      // border: "1px solid white",
                    }}
                  >
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? cusDetails.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : cusDetails
                ).map((pair, i) => (
                  <TableRow key={i}>
                    <TableCell
                      key={i}
                      align="center"
                      sx={{
                        background: "#25242D",
                        color: "white",
                        textAlign: "center",
                        // border: "1px solid white",
                      }}
                    >
                      {i + 1 + page * rowsPerPage}
                    </TableCell>
                    {cusKey.map((key, index) => (
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        key={index}
                        align="center"
                        style={{ minWidth: 170 }}
                      >
                        {key !== "TradeFileId" && pair[key] != null
                          ? key === "Remarks"
                            ? pair[key].slice(0, 15)
                            : key === "Netpl"
                            ? parseFloat(pair[key]).toFixed(2)
                            : pair[key]
                          : "--"}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        background: "#25242D",
                        color: "white",
                      }}
                      align="center"
                    >
                      <IconButton
                        style={{ color: "red" }}
                        onClick={() => deleteFile(pair.id)}
                      >
                        <DeleteIcon size="30px" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            component="div"
            count={cusDetails.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ background: "#25242D", color: "white", fontSize: "20px" }}
          />
          {/* </Paper>   */}
        </Box>
      </div>
    </>
  );
}

export default ViewSelectedFiles;
