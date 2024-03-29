import React, { useState } from "react";
import background from "../Assets/loginBackground.jpg";
import { Box, Button, Grid, Typography,Container,TextField } from "@mui/material";
import { instance } from "../Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const Login = () => {
  const [isLoading,setIsLoading]=useState(false);
  const cookies=new Cookies();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const navigate = useNavigate();
  const loginUser = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get(
        `/api/login?userName=${loginData.email}&password=${loginData.password}`
      );
      if (response.status === 200) {
        cookies.set("User", JSON.stringify(response.data), { path: "/" });
        navigate("/dashboard");
        toast.success("login Successfully !", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <div
          style={{
            content: "",
            background: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
      <Container component="main" maxWidth="sm" sx={{mt:"8rem"}}>
      {/* {isLoading && <Loading />} */}
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#25242D"
        }}
      >
        <Typography component="h1" variant="h5" sx={{color:"white",fontWeight:"bold"}}>
          LOG IN
        </Typography>
        <Box component="form"  noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            // label="Email Address"
            placeholder="Email Address"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            InputProps={{
              style: {
                borderColor: 'white',
                backgroundColor: '#9999bb',
              },
            }}
            InputLabelProps={{
              style: {
                color: 'white',
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            // label="Password"
            placeholder="Password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
            InputProps={{
              style: {
                borderColor: 'white',
                backgroundColor: '#9999bb',
              },
            }}
            InputLabelProps={{
              style: {
                color: 'white', 
              },
            }}
          />
           <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2,backgroundColor:"green" }}
            onClick={loginUser}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Box>
    </Container>
        </div>
      </div>
    </>
  );
};

export default Login;
