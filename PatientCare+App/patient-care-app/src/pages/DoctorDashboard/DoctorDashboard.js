import React, { useEffect , useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, Typography, Grid, Grid2, Alert, Snackbar, Box } from '@mui/material';
import Sidebar from '../../components/DoctorSidebar/DoctorSidebar';
import { green } from '@mui/material/colors';
import './DoctorDashboard.css';
import Earnings from '../../components/PieChart/pie.js';
import UrgentCareTable from './UrgentCare/UrgentCareTable.js';
import { getHomeStatsData } from '../../api/doctorActions';
import Task from "../../components/Task/Task.js"

const env = "prod"; // change to 'prod' for production

const DoctorDashboard = () => {
    const navigate = useNavigate();

    const [homeStats, setHomeStats] = useState({});
    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    const retrieveHomeStats = async () => {
        try {
            const homeStats = await getHomeStatsData();
            setHomeStats(homeStats);
        }
        catch (error) {
            if (error.message === "Failed to fetch") {
                showAlert('error', 'Unable to connect to the server. Please check your internet connection or try again later.')
            }
            else {
                showAlert('error', error.message);
            }
        }
    }

    useEffect(() => {
        if (env === "dev") {
            // Skip login for development
        } else if (sessionStorage.getItem('token') === null || sessionStorage.getItem('role') !== 'Doctor') {
            // Redirect to login page
            navigate('/');
        }

        retrieveHomeStats();
    }, [navigate]);

    const showAlert = (type, message) => {
        setAlert({ open: true, type: type, message: message});
        setTimeout(() => setAlert((prev) => ({ ...prev, open: false})), 3000);
    }

    return (
        <Box className="dashboard-bg">
            <Snackbar 
                open={alert.open} autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ padding: '0px 10px' }}
            >
                <Alert 
                    severity={alert.type}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
            <Sidebar className="sidebar" />
            <Box className="dashboard-container">
                {/* Main Content */}
                <Box className="flex gap-32" sx={{width: "100%", alignItems: "start", flexDirection: "column"}}>
                    <Box className="flex-col gap-24 doctor-home-card" sx={{ width: "100%", alignSelf: "stretch", justifyContent: "start" }}>
                        {/* Stats */}
                        <Box className="flex" sx={{ width: "100%"}}>
                            {/* Reports */}
                            <Box>
                                <Typography variant="p">
                                    Reports Sent:
                                </Typography>
                                <Typography variant="p"> {homeStats ? homeStats.totalReportSent : 0} </Typography>
                            </Box>
                            
                            <Box>
                                <Typography variant="p">
                                    Number of Clients:
                                </Typography>
                                <Typography variant="p"> {homeStats ? homeStats.numberOfClients : 0} </Typography>
                            </Box>

                            <Box>
                                <Typography variant="p">
                                    Urgent Care Patients:
                                </Typography>
                                <Typography variant="p"> {homeStats ? homeStats.numberOfUrgentCareClients : 0} </Typography>
                            </Box>
                        </Box>

                        {/* Urgent Care */}
                        <Box sx={{width: "100%"}}>
                            <UrgentCareTable />
                        </Box>
                    </Box>
                
                    <Box className="flex-col">                 
                        {/*EARNINGS PIE CHART */}
                        <Box className="payroll-card earnings-card" sx={{ width: "100%" }}>
                            <Typography variant="h5" className="underline" gutterBottom>
                                Earnings Report
                            </Typography>
                            <Earnings />
                        </Box>
                    </Box>
                </Box>
                <Task />
            </Box>
        </Box>
    );
}

export default DoctorDashboard;
