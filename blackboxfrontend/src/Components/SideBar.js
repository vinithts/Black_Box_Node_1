import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { NavConfig } from "./sideConfig";
import { Outlet, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import Button from '@mui/material/Button';
import { Popover } from "@mui/material";
import Cookies from "universal-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomizedSwitches from "./ThemeSwitch";
import { ThemeProvider, useTheme } from "./Context/Theme";

const SideBar = () => {
  const drawerWidth = 300;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openSubMenu, setOpenSubMenu] = React.useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popName, setPopName] = useState([]);
 
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "avatar-popover" : undefined;
  const navigate = useNavigate();
  const handleDrawerToggle = (nav, index) => {
    setMobileOpen(!mobileOpen);
  };
  const handleNav = (nav, index) => {
    if (NavConfig[index]?.subItems) {
      setOpenSubMenu(openSubMenu === index ? null : index);
    } else {
      navigate(nav);
    }
  };
  const cookies = useMemo(() => new Cookies(), []);
  useEffect(() => {
    const userName = cookies.get("User");
    const retriveData = Object.values(userName?.data[0]);
    setPopName(retriveData);
  }, [cookies]);
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {NavConfig.map((text, index) => (
          <div key={text.name}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav(text.path, index)}>
                <ListItemIcon sx={{ color: "white" }}>{text.icon}</ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItemButton>
            </ListItem>

            {/* Conditionally render subitems if the submenu is open */}
            {index === openSubMenu &&
              text.subItems &&
              text.subItems.map((subItem, subIndex) => (
                <ListItem key={subItem.name} sx={{ pl: 4 }}>
                  <ListItemButton onClick={() => navigate(subItem.path)}>
                    <ListItemIcon sx={{ color: "white" }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText primary={subItem.name} />
                  </ListItemButton>
                </ListItem>
              ))}
          </div>
        ))}
      </List>
    </div>
  );
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: "#25242D",
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontWeight: "600" }}
              >
                Black Box
              </Typography>
            </div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexGrow: 1,
                flexBasis: 0,
              }}
            >
              <CustomizedSwitches/>
            </Box>
            <Tooltip title="Account Settings" arrow>
            <Avatar
              sx={{ width: 56, height: 56,cursor:'pointer' }}
              aria-describedby={id}
              onClick={handleAvatarClick}
            >
              {" "}
              {popName[0]?.userName.charAt(0).toUpperCase()}
            </Avatar>
            </Tooltip>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box component="section" sx={{ p: 2, border: "ActiveBorder" }}>
                <Typography variant="body1"> {popName[0]?.userName}</Typography>
              </Box>
              <Divider sx={{color:"black"}}/>
              <Box component="section" sx={{ p: 1, border: "ActiveBorder" }}>
                <Typography
                  sx={{ textAlign: "center", fontSize: "18px" }}
                  onClick={() => {
                    cookies.remove("User");
                    navigate("/");
                  }}
                >  <Button>Logout{" "}&nbsp;&nbsp;&nbsp;&nbsp;
                <LogoutIcon sx={{ color: "black", fontSize: "18px" }} /></Button>
                 </Typography>
              </Box>
            </Popover>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: "#25242D",
                color: "white",
              },
            }}
            onClick={() => {
              handleDrawerToggle();
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: "#25242D",
                color: "white",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default SideBar;
