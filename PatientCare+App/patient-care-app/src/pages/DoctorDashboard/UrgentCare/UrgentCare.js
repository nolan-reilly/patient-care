import React, { useState, useEffect } from 'react';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Box, Grid2, Typography, TextField, Grid, Snackbar, Alert } from '@mui/material';
import Sidebar from '../../../components/DoctorSidebar/DoctorSidebar.js';
import UrgentCareTable from './UrgentCareTable.js';
import { addPatientToUrgentCare, removePatientFromUrgentCare } from '../../../api/doctorActions';
import './UrgentCare.css';

const UrgentCare = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });
    
    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('role') !== 'Doctor') {
            navigate('/');
        }
    }, [navigate]);

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUrgentCareTableUpdate = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    const handleAddPatientToUrgentCare = async () => {
        try {
            await addPatientToUrgentCare({ firstName, email });
            handleUrgentCareTableUpdate();
            showAlert('success', 'Succesfully added patient to Urgent Care!')
        }
        catch (error) {
            if (error.message === "Failed to fetch") {
                showAlert('error', 'Unable to connect to the server. Please check your internet connection or try again later.')
            }
            else {
                showAlert('error', error.message);
            }
        }
    };

    const handleRemovePatientFromUrgentCare = async () => {
        try {
            await removePatientFromUrgentCare({ firstName, email });
            handleUrgentCareTableUpdate();
            showAlert('success', 'Successfully removed patient from Urgent Care!')
        }
        catch (error) {
            if (error.message === "Failed to fetch") {
                showAlert('error', 'Unable to connect to the server. Please check your internet connection or try again later.')
            }
            else {
                showAlert('error', error.message);
            }
        }
    };

    const showAlert = (type, message) => {
        setAlert({ open: true, type: type, message: message});
        setTimeout(() => setAlert((prev) => ({ ...prev, open: false})), 5000);
    }

    return (
        <Box className="dashboard-bg">
            <Snackbar 
                open={alert.open} autoHideDuration={5000}
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
            <Sidebar />
            <Box className="dashboard-container">
                <Box className="flex gap-24" sx={{ width: '100%' }}>
                    {/* Table Card */}
                    <Box className="urgent-care-card" sx={{ 
                        flex: 2,
                        width: '100%',
                        minHeight: 'calc(100vh - 120px)'
                    }}>
                        <Typography variant="h5" className="underline" gutterBottom>
                            Urgent Care List
                        </Typography>
                        <Box sx={{ height: 'calc(100% - 48px)', width: '100%' }}>
                            <UrgentCareTable refreshKey={refreshKey} />
                        </Box>
                    </Box>

                    {/* Form Card */}
                    <Box className="urgent-care-card" sx={{ 
                        flex: 1,
                        width: '100%',
                        minHeight: 'calc(100vh - 120px)'
                    }}>
                        <Typography variant="h5" className="underline" gutterBottom>
                            Manage Patients
                        </Typography>
                        <Box className="flex-col gap-12">
                            <TextField
                                fullWidth
                                label="First Name"
                                helperText="Please enter patient first name"
                                onChange={handleFirstNameChange}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                helperText="Please enter patient email"
                                onChange={handleEmailChange}
                            />
                            <Box className="button-container">
                                <Button
                                    className="urgent-button"
                                    variant="contained"
                                    onClick={handleAddPatientToUrgentCare}
                                >
                                    Add New
                                </Button>
                                <Button
                                    className="urgent-button"
                                    variant="contained"
                                    onClick={handleRemovePatientFromUrgentCare}
                                    sx={{
                                        backgroundColor: red[900],
                                        '&:hover': {
                                            backgroundColor: red[800],
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UrgentCare;