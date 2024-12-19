import React, { useEffect, useState } from 'react';
import { Box, Button, Snackbar, Alert, Typography } from '@mui/material';
import { red, green } from '@mui/material/colors';
import { addDoctor, getAllDoctors, getMyDoctors, removeDoctor } from '../../../api/patientActions';
import PatientSidebar from '../../../components/PatientSidebar/PatientSidebar';
import './ViewDoctors.css';

const ViewDoctors = () => {
    const [myDoctors, setMyDoctors] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            const doctors = await getAllDoctors();

            if (doctors && Array.isArray(doctors)) {
                setAllDoctors(doctors);
            }
            else {
                setAllDoctors([]);
            }
        }

        // on load get both 'my doctors' and 'all doctors'
        fetchMyDoctors();
        fetchDoctors();
    }, [])

    const handleDoctorAdd = async (doctor_info) => {
        try {
            await addDoctor(doctor_info);

            showAlert('success', 'Doctor added successfully!');
        }
        catch (error) {
            if (error.message === "Failed to fetch") {
                showAlert('error', 'Unable to connect to the server. Please check your internet connection or try again later.')
            }
            else {
                showAlert('error', error.message);
            }
        }

        // now try to add the my doctors list
        await fetchMyDoctors();
    }

    const fetchMyDoctors = async () => {
        const doctors = await getMyDoctors();

        if (doctors && Array.isArray(doctors)) {
            setMyDoctors(doctors);
        }
        else {
            setMyDoctors([]);
        }
    }
    
    const handleRemoveDoctor = async (doctor_info) => {
        try {
            await removeDoctor(doctor_info);

            showAlert('success', 'Doctor removed successfully...')
        }
        catch (error) {
            if (error.message === "Failed to fetch") {
                showAlert('error', 'Unable to connect to the server. Please check your internet connection or try again later.')
            }
            else {
                showAlert('error', error.message);
            }
        }

        // now try to add the my doctors list
        await fetchMyDoctors();
    }

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
            <PatientSidebar tab='doctors' />
            <Box className="dashboard-container">
                <Box className="doctors-content">
                    {/* Left Column */}
                    <Box className="doctor-section">
                        <Typography variant="h5" className="underline" gutterBottom>
                            Your Doctors
                        </Typography>
                        <Box className="doctor-cards">
                            {myDoctors.map(doctor => (
                                <Box className="doctor-card" key={doctor.email}>
                                    <Box className="doctor-info">
                                        <Typography variant="h6">
                                            {`Dr. ${doctor.lastName}, ${doctor.firstName}`}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {doctor.email}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {doctor.specialization}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemoveDoctor(doctor)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Column */}
                    <Box className="doctor-section">
                        <Typography variant="h5" className="underline" gutterBottom>
                            Network Doctors
                        </Typography>
                        <Box className="doctor-cards">
                            {allDoctors
                                .filter(doctor => !myDoctors.some(myDoc => myDoc.email === doctor.email)) // Exclude doctors already in myDoctors
                                .map(doctor => (
                                    <Box className="doctor-card" key={doctor.email}>
                                        <Box className="doctor-info">
                                            <Typography variant="h6">
                                                {`Dr. ${doctor.lastName}, ${doctor.firstName}`}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {doctor.email}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {doctor.specialization}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleDoctorAdd(doctor)}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ViewDoctors;
