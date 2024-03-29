import React, { useEffect, useMemo, useState } from "react";
import Charts from "./Components/Charts";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import DropDown from "./Components/DropDown";
import { instance } from "./Api";
import ReactApexChart from "react-apexcharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ImageEncoded } from "./Components/ImageEncoded";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import logo from "./Assets/first_logo.png";
import Loading from "./Components/Loading";

const UserWiseCharts = () => {
  const [getLedger, setGetLedger] = useState([]);
  const [PortFoliotype, setPortFolioType] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("");
  const [exportType, setExportType] = useState("");
  const [userSelected, setUserSelected] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [exportData, setExportData] = useState({
    exportUserId: "",
    exportDateRange: "",
    exportAvg: "",
  });
  const filterDataByDate = useMemo(() => {
    const currentDate = new Date();
    switch (exportData.exportDateRange) {
      case "This Month":
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        return getLedger.filter(
          (entry) => new Date(entry.Time) >= startOfMonth
        );

      case "Last Month":
        const lastMonth =
          currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
        const startOfLastMonth = new Date(
          currentDate.getFullYear(),
          lastMonth,
          1
        );
        const endOfLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
        return getLedger.filter(
          (entry) =>
            new Date(entry.Time) >= startOfLastMonth &&
            new Date(entry.Time) <= endOfLastMonth
        );

      case "This Year":
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        return getLedger.filter((entry) => new Date(entry.Time) >= startOfYear);

      default:
        return getLedger;
    }
  }, [getLedger, exportData.exportDateRange]);
  const exportTableHeading = [["Date", "B/S MTM"]];
  const chartsValues = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/api/getUploadFilesLedger?fromDate= &toDate= `
      );
      if (response.status === 200) {
        setGetLedger(response.data.ledgerData);
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
  const filterUserId = getLedger.map((userId) => userId.User_ID);
  const userIDset = new Set(filterUserId);
  const uniqueId = [...userIDset];

  // selected userId chart
  const chartFilterUserId = getLedger
    .map((selectedId) => selectedId.User_ID)
    .filter((e) => e === PortFoliotype);
  const selectedUserId = new Set(chartFilterUserId);
  const uniquieUserId = [...selectedUserId];
  useEffect(() => {
    chartsValues();
  }, []);
  // --------

  const calculateBSMTM = (data) => {
    const obj = {};
    for (const char of data) {
      if (char.User_ID === PortFoliotype) {
        if (!obj[char.User_ID]) {
          obj[char.User_ID] = 0;
        }
        if (char.Txn === "BUY") {
          obj[char.User_ID] += Number(char.Avg_Price) * -Number(char.Qty);
        } else {
          obj[char.User_ID] += Number(char.Avg_Price) * Number(char.Qty);
        }
      }
    }
    const key = Object.keys(obj);
    const value = Object.values(obj);
    return [key, value];
  };
  const result = calculateBSMTM(getLedger);

  useEffect(() => {
    const result = filterDataByDate
      .filter((entry) => entry.User_ID === PortFoliotype)
      .reduce((total, entry) => {
        if (entry.Txn === "BUY") {
          return (total += Number(entry.Avg_Price) * -Number(entry.Qty));
        } else if (entry.Txn === "SELL") {
          return (total += Number(entry.Avg_Price) * Number(entry.Qty));
        }
        return total;
      }, 0);

    setExportData({
      ...exportData,
      exportUserId: PortFoliotype,
      exportAvg: result.toFixed(2),
    });
    setShowExportDropdown(filterDataByDate.length > 0);
  }, [filterDataByDate]);
  const userIdWiseFilter = getLedger
    .filter((e) => e.User_ID === PortFoliotype)
    .map((data) => data.Avg_Price);

  const userIdWiseFilterTime = getLedger
    .filter((e) => e.User_ID === PortFoliotype)
    .map((data) => data.Time);
  const date_Range = ["This Month", "Last Month", "This Year", "All Time"];
  const export_Type = ["CSV", "EXCEL", "PDF"];
  const groupedData = filterDataByDate
    .filter((e) => e.User_ID === PortFoliotype)
    .reduce((result, entry) => {
      const date = entry.Time;
      const avgPrice = Number(entry.Avg_Price);
      const qty = Number(entry.Qty);
      const isBuy = entry.Txn === "BUY";

      if (!result[date]) {
        result[date] = { totalNetpl: 0, totalQty: 0 };
      }

      if (isBuy) {
        result[date].totalNetpl += avgPrice * -qty;
      } else if (entry.Txn === "SELL") {
        result[date].totalNetpl += avgPrice * qty;
      }

      result[date].totalQty += qty;

      return result;
    }, {});

    const handleDownloadCSV = () => {
      const csvData = [
        ...exportTableHeading,
        ...Object.entries(groupedData).map(([date, data]) => [date, parseFloat(data.totalNetpl).toFixed(2)]),
        [
          "Total",
          Object.entries(groupedData)
            .map(([date, data]) => [date, parseFloat(data.totalNetpl)])
            .reduce((acc, value) => {
              return (acc = acc + value[1]);
            }, 0).toFixed(2),
        ],
      ]
        .map((row) => row)
        .join("\n");
      setLoading(true);
      const blob = new Blob([csvData], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "data.csv";
      link.click();
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      toast.success("Downloaded Successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    };
    // ----------------------------------------------------
  
    const handleDownloadXLSX = async () => {
      const workbook = new ExcelJS.Workbook(); //create excel object instance  (1st step)s
      const worksheet = workbook.addWorksheet("Sheet 1");
      const imgBase64 = ImageEncoded;
      const imageId = workbook.addImage({
        base64: imgBase64,
        extension: "png",
      });
      setLoading(true);
      worksheet.addImage(imageId, "A2:E8");
  
      const csvData = [
        ...exportTableHeading,
        ...Object.entries(groupedData).map(([date, data]) => [date, parseFloat(data.totalNetpl).toFixed(2)]),
      [
        "Total",
        Object.entries(groupedData)
          .map(([date, data]) => [date, parseFloat(data.totalNetpl)])
          .reduce((acc, value) => {
            return (acc = acc + value[1]);
          }, 0).toFixed(2),
      ],
    ];
      csvData.forEach((row) => {
        worksheet.addRow(row);
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      const url = window.URL.createObjectURL(blob);
      console.log(url);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";
      a.click();
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      toast.success("Downloaded Successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    };
  
    const handleDownloadPDF = () => {
      const doc = new jsPDF();
      const imgData = logo;
      setLoading(true);
      doc.addImage(imgData, "PNG", 13, 20, 150, 30);
      const heading = `User Id : ${PortFoliotype}`;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor("#437eb5");
  
      doc.text(15, 57, heading);
  
      doc.autoTable({
        startY: 60,
        head: [exportTableHeading[0]],
        body: [
          ...Object.entries(groupedData).map(([date, data]) => [date, parseFloat(data.totalNetpl).toFixed(2)]),
          [
            "Total",
            Object.entries(groupedData)
              .map(([date, data]) => [date, parseFloat(data.totalNetpl)])
              .reduce((acc, value) => {
                return (acc = acc + value[1]);
              }, 0).toFixed(2),
          ],
        ],
      });
      console.log(groupedData);
      doc.save("data.pdf");
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      toast.success("Downloaded Successfully !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    };
  
  const typeOfDownloads = () => {
    switch (exportType) {
      case "CSV":
        handleDownloadCSV();
        break;
      case "EXCEL":
        handleDownloadXLSX();
        break;
      case "PDF":
        handleDownloadPDF();
        break;
    }
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
            UserWise
          </Typography>

          <Grid container spacing={2} p={2}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <DropDown
                arr={uniqueId}
                label={"User Wise"}
                value={PortFoliotype}
                onChange={(e) => {
                  setPortFolioType(e.target.value);
                  setDateRange("");
                  setUserSelected(true);
                }}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <DropDown
                arr={date_Range}
                label={"Date Range"}
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setExportType("");
                  setExportData({
                    ...exportData,
                    exportDateRange: e.target.value,
                  });
                }}
                disabled={!userSelected}
              />
            </Grid>
            {dateRange && PortFoliotype && dateRange && showExportDropdown && (
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <DropDown
                  arr={export_Type}
                  label={"Export Type"}
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                />
              </Grid>
            )}
            {dateRange && exportType.length > 0 && (
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <br />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ padding: "10px" }}
                  onClick={typeOfDownloads}
                >
                  Export
                </Button>
              </Grid>
            )}
            {/* </>
            )} */}
          </Grid>
        </Box>
        <br />

        {PortFoliotype && dateRange && (
          <ChartComponent
            data={filterDataByDate.filter((e) => e.User_ID === PortFoliotype)}
          />
        )}
      </div>
    </>
  );
};

export default UserWiseCharts;

function ChartComponent({ data }) {
  // Group data by date and calculate total Netpl and total Qty for each date
  const groupedData = data.reduce((result, entry) => {
    const date = entry.Time;
    const avgPrice = Number(entry.Avg_Price);
    const qty = Number(entry.Qty);
    const isBuy = entry.Txn === "BUY";

    if (!result[date]) {
      result[date] = { totalNetpl: 0, totalQty: 0 };
    }

    if (isBuy) {
      result[date].totalNetpl += avgPrice * -qty;
    } else if (entry.Txn === "SELL") {
      result[date].totalNetpl += avgPrice * qty;
    }

    result[date].totalQty += qty;

    return result;
  }, {});

  const dates = Object.keys(groupedData);
  const calculatedValues = dates.map((date) =>
    groupedData[date].totalNetpl.toFixed(2)
  );
  const seriesData = [
    {
      name: "Calculated Value",
      data: calculatedValues,
    },
  ];

  const options = {
    chart: {
      width: 800,
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: dates,
      type: "date",
    },
    tooltip: {
      enabled: true,
    },
  };

  return (
    <div id="chart" style={{ padding: "18px" }}>
      <Card
        sx={{ background: "#25242D", borderRadius: "15px", padding: "18px" }}
      >
        {data.length > 0 ? (
          <Card
            sx={{
              borderRadius: "15px",
            }}
          >
            <ReactApexChart
              options={options}
              series={seriesData}
              type="line"
              height={340}
            />
          </Card>
        ) : (
          <Typography sx={{ color: "white", textAlign: "center" }}>
            No available data for the selected date range !.
          </Typography>
        )}
      </Card>
    </div>
  );
}
