import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box } from '@mui/material';
import '../PatientSidebar/Sidebar.css';
import Logo from "./PatientCare+.png";
import PropTypes from 'prop-types';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/PeopleAlt';
import TaskIcon from '@mui/icons-material/Task';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const DoctorSidebar = () => {
    return (
        <Box className="sidebar">
            {/* Profile Section */}
            <Box className="profile-section">
                <NavLink to='/doctor-dashboard/profile'>
                    <Box className="profile-card">
                        <img src={Logo} className="profile-pic" alt="Logo"/>
                        <Box className="name-and-email">
                            <p className="name">{sessionStorage.getItem('name')}</p>
                            <p className="email">{sessionStorage.getItem('email')}</p>
                        </Box>
                    </Box>
                </NavLink>
            </Box>

            <Box className="sidebar-content">
                <Box>
                    <p className="sidebar-category">Main</p>
                    <NavLink 
                        to='/doctor-dashboard'
                        end
                        className={({ isActive }) => 
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <HomeIcon className="sidebar-icon" />
                        <p>Home</p>
                    </NavLink>
                    
                    <NavLink 
                        to='/doctor-dashboard/payroll'
                        className={({ isActive }) => 
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <AnalyticsIcon className="sidebar-icon" />
                        <p>Payroll</p>
                    </NavLink>

                    <Box className="sidebar-section">
                        <p className="sidebar-category">Patient Management</p>
                        <NavLink 
                            to='/doctor-dashboard/client'
                            className={({ isActive }) => 
                                isActive ? 'sidebar-link-active' : 'sidebar-link'
                            }
                        >
                            <PeopleIcon className="sidebar-icon" />
                            <p>Patients</p>
                        </NavLink>

                        <NavLink 
                            to='/doctor-dashboard/task'
                            className={({ isActive }) => 
                                isActive ? 'sidebar-link-active' : 'sidebar-link'
                            }
                        >
                            <TaskIcon className="sidebar-icon" />
                            <p>Tasks</p>
                        </NavLink>

                        <NavLink 
                            to='/doctor-dashboard/urgent-care'
                            className={({ isActive }) => 
                                isActive ? 'sidebar-link-active' : 'sidebar-link'
                            }
                        >
                            <LocalHospitalIcon className="sidebar-icon" />
                            <p>Urgent Care</p>
                        </NavLink>
                    </Box>
                </Box>

                {/* Settings and Logout */}
                <Box className="sidebar-section">
                    <NavLink to='#' className='sidebar-link'>
                        <SettingsIcon className="sidebar-icon" />
                        <p>Settings</p>
                    </NavLink>

                    <NavLink 
                        to='/'
                        className={({ isActive }) => 
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <LogoutIcon className="sidebar-icon" />
                        <p>Logout</p>
                    </NavLink>
                </Box>
            </Box>
        </Box>
    );
};

DoctorSidebar.propTypes = {
    tab: PropTypes.string
};

DoctorSidebar.defaultProps = {
    tab: ''
};

export default DoctorSidebar;