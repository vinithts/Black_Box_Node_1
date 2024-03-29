import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import PersonAddAlt from "@mui/icons-material/PersonAddAlt";
import Streetview from  "@mui/icons-material/Streetview";
import Report from  "@mui/icons-material/Report";
import Settings from  "@mui/icons-material/Settings";
import FileUpload from "@mui/icons-material/FileUpload";

export const NavConfig = [
  {
    name: "Dashboard",
    path: "/Dashboard",
    icon: <SpaceDashboardIcon color="white" />,
  },
  {
    name: "UserWise",
    path: "/Dashboard/userWiseChart",
    icon: <SupervisedUserCircleIcon color="white" />,
  },
  {
    name: "Customer",
    path: "/Dashboard",
    icon: <PeopleAlt color="white" />,
    subItems: [
      {
        name: "Add Customer",
        path: "/Dashboard/addcustomernew",
        icon: <PersonAddAlt color="white" />,
      },
      {
        name: "View Customer",
        path: "/Dashboard/viewcustomerDetails",
        icon: <Streetview color="white" />,
      },
    ],
  },
  // {
  //   name: "Report",
  //   path: "/Dashboard/report",
  //   icon: <Report color="white" />,
  // },
  {
    name: "Settings",
    path: "/Dashboard",
    icon: <Settings color="white" />,
    subItems: [
      {
        name: "Uploads",
        path: "/Dashboard/upload",
        icon: <FileUpload color="white" />,
      },
      {
        name: "ViewUploads",
        path: "/Dashboard/viewupload",
        icon: <Streetview color="white" />,
      },
    ],
  },
];
