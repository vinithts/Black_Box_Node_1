import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { AiFillTag } from "react-icons/ai";

const AppletCard = ({ one, two, three, title, value }) => {
  const appletColor = {
    width: "100%",
    height: "150px",

    background: one
      ? "linear-gradient(to left, #121D3A, #0B0A0F)"
      : two
      ? "linear-gradient(to right,black, #1F3E28)"
      : three
      ? "linear-gradient(to right, black, #3A5283)"
      : "",
    padding: "8px",
    borderRadius: "10px",
    position: "relative",
  };
  return (
    <div style={{ padding: "15px" }}>
      <Card sx={appletColor}>
        <Box sx={{ padding: "8px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "500", color: "white", float: "left" }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "600",
              paddingTop: "40px",
              color: "white",
              float: "left",
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            background: "#FFFAFA1A",
            width: "55px",
            textAlign: "center",
            padding: "5px",
            borderRadius: "50%",
            height: "55px",
            position: "absolute",
            right: "10%",
            bottom: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography>
            <AiFillTag size={25} color={"white"} />
          </Typography>
        </Box>
      </Card>
    </div>
  );
};

export default AppletCard;
