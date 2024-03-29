import React from 'react'
import { useEffect } from 'react'
import { getCustomersDetails } from '../Components/Accordion'
import { useState } from 'react'
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Loading from "../Components/Loading";
import { toast } from "react-toastify";
import { instance } from "../Api";

const ViewCustomerDetails = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerHead, setCustomerHead] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    getCustomersDetails().then((res) => {
      if (
        res.status === 200 &&
        Array.isArray(res.data) &&
        res.data.length > 0
      ) {
        setAllCustomers(res.data);
        setCustomerHead(Object.keys(res.data[0]));
        setLoading(false);
      } else {
        setLoading(false);
        // Handle the case where res.data is not as expected
        console.error("Invalid response format:", res.data);
      }
    });
  };
  useEffect(() => {
    getData();
  }, []);
  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16,
      },
      "&:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      "&:after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
  }));
  const updateStatus = async (status, id) => {
    setLoading(true);
    try {
      const response = await instance.put(
        `api/updateStatus?status=${status}&id=${id}`
      );
      await getData();
      await toast.success(response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
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
  return (
    <div>
      {loading && <Loading />}
      {!loading && allCustomers.length === 0 ? (
        <Typography
          sx={{
            marginTop:'10rem',
            textAlign: "center",
            color: "white",
            fontSize: "18px",
          }}
        >
          No customers available!
        </Typography>
      ) : (
        <>
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: "600", padding: "20px" }}
          >
            All Customers
          </Typography>
          <Card sx={{ padding: "15px", background: "#25242D" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {customerHead?.map((head) => (
                      <TableCell
                        align={"center"}
                        style={{
                          minWidth: 170,
                          background: "#25242D",
                          color: "white",
                          fontWeight: "600",
                        }}
                        key={head}
                      >
                        {head.charAt(0).toUpperCase() + head.slice(1)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allCustomers.map((pair, i) => (
                    <TableRow key={i}>
                      {customerHead.map((key, index) =>
                        key === "status" ? (
                          <TableCell
                            sx={{ background: "#25242D", color: "white" }}
                            key={index}
                            align="center"
                            style={{ minWidth: 170 }}
                          >
                            <FormControlLabel
                              control={
                                <Android12Switch
                                  checked={pair[key] === "Active"}
                                  onChange={() =>
                                    updateStatus(
                                      pair[key] === "Active"
                                        ? "In-Active"
                                        : "Active",
                                      pair.id
                                    )
                                  }
                                />
                              }
                              label={pair[key]}
                            />
                          </TableCell>
                        ) : (
                          <TableCell
                            sx={{ background: "#25242D", color: "white" }}
                            key={index}
                            align="center"
                            style={{ minWidth: 170 }}
                          >
                            {pair[key]}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </div>
  );
};

export default ViewCustomerDetails;