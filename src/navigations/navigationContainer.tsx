import React, { useState } from "react";
import PropTypes from "prop-types";
import AppBar from '@mui/material/AppBar';
import CssBaseline from "@mui/material/CssBaseline";
import Box from '@mui/material/Box';
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';

import dashboard from '../assets/images/dashboard.svg'
import draft from '../assets/images/draft.svg'
import pending from '../assets/images/pending.svg'
import rejected from '../assets/images/rejected.svg'
import approved from '../assets/images/approved.svg'
import query from '../assets/images/query.svg'
import admin from '../assets/images/admin.svg'
import logo from '../assets/images/Logo.svg'
import './navigationContainer.css'
import CustomizedSearchInput from '../components/search.tsx';
import bell from '../assets/images/bell.svg'
import user from '../assets/images/user.svg'
import logout from '../assets/images/logout.svg'
import Badge from '@mui/material/Badge';
import add from '../assets/images/plus.svg'
import line from '../assets/images/line.svg'
import verticalLine from '../assets/images/verticalLine.svg'
import { DashBoardScreen } from "../screens/home/DashBoard.tsx";
import { CreateExpense } from "../screens/expense/createExpense.tsx";
import { DraftScreen } from "../screens/draft/draftScreen.tsx";
import { ExpenseDetailsHome } from "../screens/expenseDetail/expenseDetailHome.tsx";
import backgroundImage from '../assets/images/screenBGImage.svg';
import { PendingScreen } from "../screens/pending/pendingScreen.tsx";
import { RejectScreen } from "../screens/rejected/reject.tsx";
import { ApprovalScreen } from "../screens/approval/approval.tsx";
import { QueryScreen } from "../screens/query/queryScreen.tsx";
import { UserProfile } from "../screens/profile/userProfile.tsx";
import { NotificationScreen } from "../screens/notification/notificationScreen.tsx";
import { TeamRequestScreen } from "../screens/teamRequest/teamrequest.tsx";
import { TeamRequestListScreen } from "../screens/teamRequest/teamRequestScreen.tsx";
import { LogOutPopup } from "../components/logOutPopup.tsx";
import { MasterExpense } from "../screens/admin/masterExpense.tsx";
import { MasterSubExpense } from "../screens/admin/masterSubExpense.tsx";
import { useDispatch, useSelector } from 'react-redux';

import { selectTabName, setTabName } from '../Redux/features/sideBarMenu/sideBarMenuSlicer.js'

import GoogleMap from "../components/googleMap.js";

import teamreq from '../assets/images/teamreq.svg'
import { EditMasterSubExpense } from "../screens/admin/editMasterSubExpense.tsx";
import { CityTier } from "../screens/admin/cityTier.tsx";
import { CityList } from "../screens/admin/cityList.tsx";
import { GradeSCreen } from "../screens/admin/grade.tsx";
import { GradePolicy } from "../screens/admin/gradePolicy.tsx";
import { ManagementProfile } from "../screens/admin/managementProfile.tsx";
import { EmployeeAdminScreen } from "../screens/admin/employee.tsx";
import { EmployeeAdminDetails } from "../screens/admin/employeeAdminDetails.tsx";
import URLNotFound from "../components/urlNotFound.tsx";

import Tooltip from '@mui/material/Tooltip';
import { ManagementProfileAdminDetails } from "../screens/admin/managementProfileEdit.tsx";
import { GradePolicyListScreen } from "../screens/admin/gradePolicyList.tsx";
import { HodProfileNew } from "../screens/admin/HodProfile.tsx";

import { selectData } from '../Redux/features/login/loginSlicer.js';
import userAvatar from '../assets/images/userAvatar.png'
import { EditGradePolicy } from "../screens/admin/editGradePolicy.tsx";
import { NewCreateExpense } from "../screens/expense/newCreateexpense.tsx";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabName = useSelector(selectTabName);
  console.log("tabName>>", tabName)
  const { container } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [menuItem, setMenuItem] = useState<number>()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const loginStatus = useSelector(selectData);
  // console.log("Navigation loginStatus>>", loginStatus?.role?.role)
  console.log("Navigation loginStatus>>", loginStatus)
  const employeeMenu = [
    { id: 0, title: 'Dashboard', icon: dashboard, link: 'home' },
    { id: 1, title: 'Draft', icon: draft, link: 'draft' },
    { id: 2, title: 'Pending', icon: pending, link: 'pending' },
    { id: 3, title: 'Rejected', icon: rejected, link: 'reject' },
    { id: 4, title: 'Approved', icon: approved, link: 'approval' },
    { id: 5, title: 'Query', icon: query, link: 'query' },
  ]
  const HRMenu = [
    { id: 0, title: 'Dashboard', icon: dashboard, link: 'home' },
    { id: 1, title: 'Draft', icon: draft, link: 'draft' },
    { id: 2, title: 'Pending', icon: pending, link: 'pending' },
    { id: 3, title: 'Rejected', icon: rejected, link: 'reject' },
    { id: 4, title: 'Approved', icon: approved, link: 'approval' },
    { id: 5, title: 'Query', icon: query, link: 'query' },
    // { id: 6, title: 'Team Request', icon: teamreq, link: 'teamrequest' }, // if hr is hod
    { id: 7, title: 'All Request', icon: teamreq, link: 'teamrequest' }, 
    { id: 8, title: 'Admin', icon: admin, link: 'admin/masterExpense' },
  ]
  const HODMenu = [
    { id: 0, title: 'Dashboard', icon: dashboard, link: 'home' },
    { id: 1, title: 'Draft', icon: draft, link: 'draft' },
    { id: 2, title: 'Pending', icon: pending, link: 'pending' },
    { id: 3, title: 'Rejected', icon: rejected, link: 'reject' },
    { id: 4, title: 'Approved', icon: approved, link: 'approval' },
    { id: 5, title: 'Query', icon: query, link: 'query' },
    { id: 6, title: 'Team Request', icon: teamreq, link: 'teamrequest' },
  ]
  const ManagementMenu = [
    { id: 0, title: 'Dashboard', icon: dashboard, link: 'home' },
    { id: 1, title: 'Draft', icon: draft, link: 'draft' },
    { id: 2, title: 'Pending', icon: pending, link: 'pending' },
    { id: 3, title: 'Rejected', icon: rejected, link: 'reject' },
    { id: 4, title: 'Approved', icon: approved, link: 'approval' },
    { id: 5, title: 'Query', icon: query, link: 'query' },
    // { id: 6, title: 'Team Request', icon: teamreq, link: 'teamrequest' }, // if mgm is hod
    { id: 6, title: 'Management Request', icon: teamreq, link: 'teamrequest' },
  ]

  const adminMenu = [
    { id: 0, title: 'Master Expense', link: 'admin/masterExpense' },
    { id: 1, title: 'Sub-Master Expense', link: 'admin/masterSubExpense' },
    { id: 2, title: 'City Tier', link: 'admin/cityTier' },
    { id: 3, title: 'City List', link: 'admin/cityList' },
    { id: 4, title: 'Grade', link: 'admin/grade' },
    // { id: 5, title: 'Grade Policy', link: 'admin/gradePolicy' }, 
    { id: 5, title: 'Grade Policy', link: 'admin/gradePolicyList' },
    { id: 6, title: 'Management Profile', link: 'admin/managementProfile' },
    { id: 7, title: 'Hod Profile', link: 'admin/HodProfileNew' },
    { id: 8, title: 'Employee', link: 'admin/employeeAdmin' },
  ]

  const handleAdminMenuList = (id: any, title: string) => {
    setMenuItem(id)
    dispatch(setTabName(title))
  }

  const [activeMenu, setActiveMenu] = useState(0)
  const sideBarHandler = (i: number, tabname: string) => {
    setActiveMenu(i)
    if (i == 0) {
      navigate('/home');
    }
    dispatch(setTabName(tabname))
    setMenuItem(0)
  }

  const drawer = (
    <div>
      <div className='alignItem-center d-flex justfyContent-center p-1rem'>
        <img src={logo} className='logo' />
        <span className="bold1_56Rem darkBlack">Expense</span>
      </div>
      <Divider />
      <div className='d-flex column h-90vh space-between'>
        {
          loginStatus?.role?.role === "EMPLOYEE" &&
          <List>
            {employeeMenu.map((item, index) => (
              <ListItem key={item.title} disablePadding onClick={() => sideBarHandler(index, item.link)} component={Link} to={"/" + item.link} className="scale-effect">
                <ListItemButton style={{ backgroundColor: (window.location.pathname === ("/" + item.link)) ? '#DBEEFF' : 'transparent' }}>
                  <ListItemIcon>
                    <img src={item.icon} className='menuIcon' />
                  </ListItemIcon>
                  <ListItemText primary={item.title} className="commonBlackcolor regular1_26Rem" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        }
        {
          loginStatus?.role?.role === "HR" &&
          <List>
            {HRMenu.map((item, index) => (
              <ListItem key={item.title} disablePadding onClick={() => sideBarHandler(index, item.link)} component={Link} to={"/" + item.link} className="scale-effect">
                <ListItemButton style={{ backgroundColor: (window.location.pathname === ("/" + item.link)) ? '#DBEEFF' : 'transparent' }}>
                  <ListItemIcon>
                    <img src={item.icon} className='menuIcon' />
                  </ListItemIcon>
                  <ListItemText primary={item.title} className="commonBlackcolor regular1_26Rem" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        }
        {
          loginStatus?.role?.role === "HOD" &&
          <List>
            {HODMenu.map((item, index) => (
              <ListItem key={item.title} disablePadding onClick={() => sideBarHandler(index, item.link)} component={Link} to={"/" + item.link} className="scale-effect">
                <ListItemButton style={{ backgroundColor: (window.location.pathname === ("/" + item.link)) ? '#DBEEFF' : 'transparent' }}>
                  <ListItemIcon>
                    <img src={item.icon} className='menuIcon' />
                  </ListItemIcon>
                  <ListItemText primary={item.title} className="commonBlackcolor regular1_26Rem" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        }
        {
          loginStatus?.role?.role === "Japaness" &&
          <List>
            {ManagementMenu.map((item, index) => (
              <ListItem key={item.title} disablePadding onClick={() => sideBarHandler(index, item.link)} component={Link} to={"/" + item.link} className="scale-effect">
                <ListItemButton style={{ backgroundColor: (window.location.pathname === ("/" + item.link)) ? '#DBEEFF' : 'transparent' }}>
                  <ListItemIcon>
                    <img src={item.icon} className='menuIcon' />
                  </ListItemIcon>
                  <ListItemText primary={item.title} className="commonBlackcolor regular1_26Rem" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        }
        {
          loginStatus?.role?.role === "HR" ?
            <>
              {
                window.location.pathname.split('/')[1] === "admin" &&
                <List className="adminMenu">
                  {adminMenu.map((item, index) => (
                    <ListItem className="d-flex column adminMenuFlex bg-Effect " key={index} component={Link} to={"/" + item.link}>
                      <div className="d-flex row justfyContent-start adminMenuWidth" onClick={() => handleAdminMenuList(index, item.title)}>
                        <div className="adminLine d-flex alignItem-end">
                          <img src={verticalLine} className={adminMenu.length-1 === index ? "vertical-line-last" :"" } />
                          <img src={line} className="horizontal-line" />
                        </div>
                        <div className="adminText d-flex alignItem-center ">
                          <span className={` menuText ${menuItem === index || tabName?.tabName === item?.title ? "bold0_875Rem commonBlue" : "light0_65Rem "} `}>{item.title}</span>
                        </div>
                      </div>
                    </ListItem>
                  ))}
                </List>
              }
            </>
            :
            ""
        }
        {
          <List>
            <ListItem style={{ backgroundColor: '#DBEEFF' }} disablePadding>
              <ListItemButton onClick={() => handleLogOut()}>
                <ListItemIcon>
                  <img src={logout} className='menuIcon' />
                </ListItemIcon>
                <ListItemText primary="Log out" className="commonBlackcolor regular1_26Rem" />
              </ListItemButton>
            </ListItem>
          </List>
        }
      </div>
    </div>
  );
  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Adjust the height as needed
  };

  const [isLogOutPopup, setLogOutPopup] = useState(false)
  const handleLogOut = () => {
    setLogOutPopup(true)
    console.log("handleLogOut called")

  }
  const AdminRouteGuard = ({ element }) => {
    // Check if the user is an admin, if not, redirect to the home page
    if (loginStatus?.role?.role !== 'HR') {
      return <Navigate to="/home" />;
    }
    // If the user is an admin, render the admin component
    return element;
  };

  const AdminTeamRequestRouteGuard = ({ element }) => {
    if (loginStatus?.role?.role === 'EMPLOYEE') {
      return <Navigate to="/home" />;
    }
    return element;
  }

  const handleRoute = () => {

    // navigate('/createExpense')
    // setTimeout(()=> window.location.reload(), 500)
    // window.location.reload();
  }
  return (
    <div style={containerStyle}>
      {/* <Router> */}
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          style={{ boxShadow: 'none', borderBottom: 'solid 2px #12203B17', backgroundColor: 'white' }}
          color='transparent'
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar className=' d-flex row alignItem-center space-between' sx={{ width: { sm: `calc(100%)` } }}>
            <div className="d-flex row alignItem-center ">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                =
              </IconButton>
              <CustomizedSearchInput />
            </div>
            <div>
              <Link to={'/createExpense'} onClick={() => handleRoute()}>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <button className="addExpenseButton">
                    <div className="d-flex row justfyContent-center alignItem-center pr-20px pl-20px">
                      <Tooltip title="Add Expense" arrow className="viewToolTip">
                        <img src={add} />
                      </Tooltip>
                      <span className="ml-20px white regular0_875Rem displayAddExpense">Add Expense</span>
                    </div>
                  </button>
                </Box>
              </Link>
            </div>
            <div className='d-flex alignItem-center'>
              <Badge color="secondary" variant="dot" overlap="circular">
                <Link to={'/notification'}><img src={bell} /></Link>
              </Badge>
              <Divider orientation="vertical" flexItem className="divider"
              //  sx={{ display: { xs: 'none', sm: 'block' } }}
              />
              <Box >
                <div className='d-flex alignItem-center'>
                  <Box
                  // sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    <Link to={'/profile'} className="d-flex alignItem-center row">
                      <img src={userAvatar} style={{ height: 30, width: 30 }} />
                      <span className="divider">{loginStatus?.role?.name ? loginStatus?.role?.name : "My Account"}</span>
                    </Link>
                  </Box>
                </div>

              </Box>
            </div>
          </Toolbar>
        </AppBar>

        {/* <Router> */}
        <nav aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
            className="ssss"
          >
            {drawer}
          </Drawer>
        </nav>
        {/* **************   body   ******************* */}
        <main className="">
          <div />
          <Box
            component="main"
            className="inside"
          >
            <Toolbar />
            <Routes>
              <Route path="/home" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` },
                    ml: { sm: `20px` },
                  }}
                  className="innnnnn"
                >
                  <DashBoardScreen />
                </Box>

              } />
              <Route path="/draft" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` }, //vw
                    ml: { sm: `20px` },
                  }}
                >
                  <DraftScreen />
                </Box>
              } />
              <Route path="/pending" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` },
                    ml: { sm: `20px` },
                  }}
                >
                  <PendingScreen />
                </Box>
              } />
              <Route path="/reject" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` },
                    ml: { sm: `20px` },
                  }}
                >
                  <RejectScreen />
                </Box>
              } />
              <Route path="/approval" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` },
                    ml: { sm: `20px` },
                  }}
                >
                  <ApprovalScreen />
                </Box>
              } />
              <Route path="/query" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` },
                    ml: { sm: `20px` },
                  }}
                >
                  <QueryScreen />
                </Box>
              } />
              {/* <Route path="/createExpense" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` }, //vw
                    ml: { sm: `20px` },
                  }}
                  className="innnnnn"
                >
                  <CreateExpense />
                </Box>

              } /> */}
              <Route path="/expenseDetails" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` }, //vw
                    ml: { sm: `20px` },
                  }}
                  className="innnnnn"
                >
                  <ExpenseDetailsHome />
                </Box>
              } />
              <Route path="/profile" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` }, //vw
                    ml: { sm: `20px` },
                  }}
                  className="innnnnn"
                >
                  <UserProfile />
                </Box>
              } />
              <Route path="/notification" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` },
                    ml: { sm: `20px` },
                  }}
                >
                  <NotificationScreen />
                </Box>
              } />
              <Route path="/isLogout" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` }, //vw
                    ml: { sm: `20px` },
                  }}
                  className="innnnnn"
                >
                  <LogOutPopup close={() => setLogOutPopup(false)} />
                </Box>
              } />

              <Route path="/teamRequest"
                element={
                  <AdminTeamRequestRouteGuard
                    element={
                      <Box
                        component="main"
                        sx={{
                          width: { sm: `calc(100%)` }, //vw
                          ml: { sm: `20px` },
                        }}
                        className="innnnnn"
                      >
                        <TeamRequestListScreen />
                      </Box>
                    }
                  />
                }
              />
              <Route path="/admin/masterExpense"
                element={
                  <AdminRouteGuard
                    element={
                      <Box
                        component="main"
                        sx={{
                          width: { sm: `calc(100%)` }, //vw
                          ml: { sm: `20px` },
                        }}
                        className="innnnnn"
                      >
                        <MasterExpense />
                      </Box>
                    }
                  />
                }
              />
              <Route path="/admin/masterSubExpense"
                element={
                  <AdminRouteGuard
                    element={
                      <Box
                        component="main"
                        sx={{
                          width: { sm: `calc(100%)` }, //vw
                          ml: { sm: `20px` },
                        }}
                        className="innnnnn"
                      >
                        <MasterSubExpense />
                      </Box>
                    }
                  />
                }
              />
              <Route path="/admin/editMasterSubExpense"
                element={
                  <AdminRouteGuard
                    element={
                      <Box
                        component="main"
                        sx={{
                          width: { sm: `calc(100%)` }, //vw
                          ml: { sm: `20px` },
                        }}
                        className="innnnnn"
                      >
                        <EditMasterSubExpense />
                      </Box>
                    }
                  />
                } />
              <Route path="/admin/cityTier" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <CityTier />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/cityList" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <CityList />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/grade" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <GradeSCreen />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/gradePolicy" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <GradePolicy />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/editGradePolicy" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <EditGradePolicy />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/gradePolicyList" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <GradePolicyListScreen />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/managementProfile" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <ManagementProfile />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/HodProfileNew" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <HodProfileNew />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/employeeAdmin" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <EmployeeAdminScreen />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/employeeAdminDetails" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <EmployeeAdminDetails />
                    </Box>
                  }
                />
              } />
              <Route path="/admin/managementAdminDetails" element={
                <AdminRouteGuard
                  element={
                    <Box
                      component="main"
                      sx={{
                        width: { sm: `calc(100%)` }, //vw
                        ml: { sm: `20px` },
                      }}
                      className="innnnnn"
                    >
                      <ManagementProfileAdminDetails />
                    </Box>
                  }
                />
              } />
               <Route path="/createExpense" element={
                <Box
                  component="main"
                  sx={{
                    width: { sm: `calc(100%)` }, //vw
                    ml: { sm: `20px` },
                  }}
                  className="innnnnn"
                >
                  <NewCreateExpense />
                </Box>

              } /> 
              {/* <Route path="/*" element={<Navigate to='/home' />} /> */}
              <Route path="/*"
                element={
                  <Navigate to="/home" replace />
                  // <div>
                  //   <URLNotFound />
                  // </div>
                } />
            </Routes>

          </Box>
        </main>
      </Box>
      {
        isLogOutPopup &&
        <LogOutPopup close={() => setLogOutPopup(false)} />
      }
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  container: PropTypes.instanceOf(
    typeof Element === "undefined" ? Object : Element
  )
};

export default ResponsiveDrawer;