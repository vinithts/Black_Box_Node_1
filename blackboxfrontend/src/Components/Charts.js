import { Card, Typography } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

function ChartComponent({ data1, downData1, userWise, data2, data3 }) {
  console.log(data1[1]);
  const seriesData = [
    {
      name: "B/S MTM",
      data: userWise
        ? data1[1].map((e) => Number(e).toFixed(1))
        : downData1[1].map((e) => Number(e).toFixed(1)),
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
      categories: userWise ? data1[0] : downData1[0].map((e) => e),
      // categories: [...new Set(data3)],
      // type: "datetime",
      tickAmount: 100, // Adjust the number of ticks as needed
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
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
        <Typography
          sx={{
            color: "white",
            fontSize: "22px",
            fontWeight: "700",
            padding: "18px",
          }}
        >
          All Customers Data
        </Typography>

        <Card
          sx={{
            // background: "#25242D",
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
      </Card>
    </div>
  );
}

export default ChartComponent;
