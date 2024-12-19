import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box } from '@mui/material';
import './Sidebar.css';
import Logo from "./PatientCare+.png";

// MUI SVG Icons
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const PatientSidebar = () => {
    return (
        <Box className="sidebar">
            {/* Profile Section */}
            <Box className="profile-section">
                <NavLink to='/patient-dashboard/profile'>
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
                        to='/patient-dashboard'
                        end
                        className={({ isActive }) => 
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <HomeIcon className="sidebar-icon" />
                        <p>Home</p>
                    </NavLink>
                    
                    <NavLink 
                        to='/patient-dashboard/analytics'
                        className={({ isActive }) => 
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <BarChartIcon className="sidebar-icon" />
                        <p>Analytics</p>
                    </NavLink>

                    <Box className="sidebar-section">
                    <p className="sidebar-category">Health Management</p>
                    <NavLink 
                        to='/patient-dashboard/doctors'
                        className={({ isActive }) => 
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <PeopleAltIcon className="sidebar-icon" />
                        <p>Doctors</p>
                    </NavLink>

                    <NavLink 
                        to='/patient-dashboard/record-center'
                        className={({ isActive }) => 
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <FormatListBulletedIcon className="sidebar-icon" />
                        <p>Records</p>
                    </NavLink>
                </Box>
                </Box>

                {/* Settings and Logout */}
                <Box className="sidebar-section">
                    <NavLink to="#" className='sidebar-link'>
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

export default PatientSidebar;