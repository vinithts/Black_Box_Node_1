import React, { useEffect, useState } from "react";
import { instance } from "../Api";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ViewUploads() {
  const [getTradeFiles, setGetTradeFiles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const getFiles = async () => {
    try {
      const response = await instance.get(`/api/tradeFiles`);
      if (response.status === 200) {
        setGetTradeFiles(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onHandleClickopen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const deleteFiles = async (id) => {
    try {
      const response = await instance.delete(`/api/tradeFile/${id}`);
      if (response.status === 200) {
        console.log("success");
        getFiles();
        // Display success message using toast
        toast.success("File deleted successfully");
      }
    } catch (e) {
      console.log(e);
      // Display error message using toast
      toast.error("Error deleting file");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div>
      {getTradeFiles.length > 0 ? (
        <Box sx={{ padding: "10px" }}>
          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            Uploaded Files
          </Typography>
          <div>
            <TableContainer
              component={Paper}
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
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      SI.NO
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      File Name
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      View
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? getTradeFiles.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : getTradeFiles
                  ).map((e, index) => (
                    <TableRow
                      key={e.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        {e.tradeFIle}
                      </TableCell>
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={() =>
                            navigate(`/Dashboard/ViewSelectedFiles/${e.id}`)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          onClick={onHandleClickopen}
                        >
                          Delete
                        </Button>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogContent>
                            <DialogContentText
                              id="alert-dialog-description"
                              style={{
                                textAlign: "center",
                                padding: "20px",
                                fontSize: "25px",
                                fontFamily: "bold",
                                color: "black",
                              }}
                            >
                              Are you sure want to delete this file ?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => deleteFiles(e.id)}
                              style={{
                                backgroundColor: "green",
                                color: "white",
                              }}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={handleClose}
                              autoFocus
                              style={{ backgroundColor: "red", color: "white" }}
                            >
                              No
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {getTradeFiles.length > 5 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                component="div"
                count={getTradeFiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ background: "#25242D", color: "white", fontSize: "20px" }}
              />
            )}
          </div>
        </Box>
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            marginTop:"10rem",
            color: "white",
            fontSize: "18px",
          }}
        >
          No Files available !
        </Typography>
      )}
    </div>
  );
}

export default ViewUploads;
