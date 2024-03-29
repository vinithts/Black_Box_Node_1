import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import ModalComponent from "../Components/ModalComponent";

const AddCustomer = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div>
        <Box sx={{ width: "100%", padding: "15px" }}>
          <Button
            onClick={handleOpen}
            variant="contained"
            sx={{
              float: "right",
              background: "white",
              color: "black",
              fontWeight: "600",
              "&:hover": {
                background: "white",
              },
            }}
          >
            Add Customer
          </Button>
        </Box>

        {/* modal card */}
        <Box>
          <ModalComponent open={open} handleClose={handleClose} />
        </Box>
      </div>
    </>
  );
};

export default AddCustomer;
