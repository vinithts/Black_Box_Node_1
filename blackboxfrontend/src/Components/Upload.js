import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { instance } from "../Api";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { Button, Box, Typography, Grid } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUploads = async () => {
    if (!selectedFile) {
      toast.error("Please choose a file!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await instance.post(`/api/tradeFile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Uploaded successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        setSelectedFile(null);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        toast.error("An error occurred while uploading the file.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loading />}
      <Box sx={{ padding: "10px" }}>
        <Typography variant="h4" sx={{ color: "white", textAlign: "center", fontWeight: "600" }}>
          Upload Files
        </Typography>
        <Form.Group controlId="formFile">
          <Form.Label style={{ color: "gray", fontWeight: "600", paddingTop: "20px" }}>
            Upload csv, xlsx
          </Form.Label>
          <Grid container spacing={3}>
            <Grid item xl={10} lg={10} md={10} sm={12} xs={12}>
              <Form.Control
                type="file"
                ref={fileInputRef}
                accept=".xls,.xlsx,.csv"
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "bold",
                  width: "100%",
                }}
                onClick={handleFileUploads}
                startIcon={<FileUploadIcon />}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </Form.Group>
      </Box>
    </div>
  );
};

export default Upload;
