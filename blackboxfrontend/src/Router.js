// import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
// import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
// export const NavConfig = [
//   {
//     name: "Dashboard",
//     path: "/Dashboard",
//     icon: <SpaceDashboardIcon color="white" />,
//   },
//   {
//     name: "UserWise",
//     path: "/userWiseChart",
//     icon: <SupervisedUserCircleIcon color="white" />,
//   },
// ];

import React from "react";
import { useRoutes } from "react-router-dom";
import Login from "./Pages/Login";
import DashBoard from "./Pages/DashBoard";
import DashboardPage from "./Components/DashboardPage";
import UserWiseCharts from "./UserWiseCharts";
import Upload from "./Components/Upload";
import AddCustomerNew from "./Pages/AddCustomerNew";
import ViewCustomer from "./Pages/ViewCustomerDetails";
import Report from "./Report";
import ViewCustomerDetails from "./Pages/ViewCustomerDetails";
import ViewUploads from "./Pages/ViewUploads";
import ViewSelectedFiles from "./Pages/ViewSelectedFiles";

const Router = () => {
  return useRoutes([
    { path: "/", element: <Login /> },
    {
      path: "/Dashboard",
      element: <DashboardPage />,
      children: [
        { path: "/Dashboard", element: <DashBoard /> },
        { path: "userWiseChart", element: <UserWiseCharts /> },
        { path: "upload", element: <Upload /> },
        { path: "addcustomernew", element: <AddCustomerNew /> },
        { path: "viewcustomerDetails", element: <ViewCustomerDetails /> },
         { path: "viewupload", element:<ViewUploads/>},
         { path: "ViewSelectedFiles/:id", element:<ViewSelectedFiles/>}
      ],
    },
  ]);
};

export default Router;
