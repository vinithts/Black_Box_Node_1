import { Box } from "@mui/material";
import React from "react";
import { Puff, Vortex } from "react-loader-spinner";
const Loading = () => {
  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          //   background: "rgba(255, 255, 255, 0.7)",
          width: "80%",
          height: "90vh",
        }}
      >
        <div style={{ top: "35%", position: "absolute", left: "48%" }}>
          {/* <Puff
            height="80"
            width="80"
            radius={1}
            color="#000000"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          /> */}
          <Vortex
            visible={true}
            height="120"
            width="120"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={["red", "green", "blue", "yellow", "orange", "purple"]}
          />
        </div>
      </Box>
    </div>
  );
};

export default Loading;
