import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Paper, Box, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import Sidebar from '../../../components/DoctorSidebar/DoctorSidebar.js';
import Earnings from '../../../components/PieChart/pie.js';
import PayrollTable from './PayrollTable.js';
import "./Payroll.css";

const Payroll = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('role') !== 'Doctor') {
            // Redirect to login page
            navigate('/');
        }
    }, [navigate]);

    return (
        <Box className="dashboard-bg">
            <Sidebar />
            <Box className="dashboard-container">
                <Box className="payroll-content flex-col gap-24">
                    <Box className="flex gap-24">
                        {/* Time Sheet Card */}
                        <Box className="payroll-card">
                            <Typography variant="h5" className="underline" gutterBottom>
                                Time Sheet
                            </Typography>
                            <PayrollTable />
                        </Box>

                        {/* Earnings Card */}
                        <Box className="payroll-card earnings-card">
                            <Typography variant="h5" className="underline" gutterBottom>
                                Earnings Report
                            </Typography>
                            <Earnings />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Payroll