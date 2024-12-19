import React, { useState, useEffect } from 'react';
import PatientSidebar from '../../../components/PatientSidebar/PatientSidebar';
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Alert, Snackbar } from '@mui/material';
import { getPatientHealthRecord } from '../../../api/patientActions';
import "./DataCenter.css"

const DataCenter = () => {
    const [healthData, setHealthData] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    const retrieveHealthData = async () => {
        try {
            const data = await getPatientHealthRecord();

            if (data === null) {
                return;
            }

            parseHealthData(data);
        }
        catch (error) {
            showAlert('error', 'An error occurred while retrieving health data.');
        }
    }

    const parseHealthData = (data) => {
        let collection = [];

        data.healthData.forEach(element => {

            const date = new Date(element.dateTime);
            date.setHours(date.getHours() - 5);

            collection.push({
                date: date,
                glucose: element.glucoseLevel,
                sugar: element.bloodSugar,
                heartrate: element.heartRate,
                bloodpressure: element.bloodPressure
            });
        });

        setHealthData(collection.reverse());
        setPrescriptions(data.patientPrescriptionData);
        setMessageHistory(data.doctorNoteData);
    }

    useEffect(() => {
        retrieveHealthData();      
    }, [])

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
            <Box className="dashboard-container">
                <PatientSidebar />
                <Box className="flex-col gap-32" sx={{ width: "100%"}}>
                    <Box className="flex gap-32" sx={{ width: "100%" }}>
                        <Box 
                            className='record-card records-section'
                            sx={{ flex: 1,
                                  width: "100%",

                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Health Record History
                            </Typography>
                            <TableContainer className="table-container">
                                <Table stickyHeader aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                                Date
                                            </TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                                Glucose (mg/dL)
                                            </TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                                Sugar (mg/dL)
                                            </TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                                Heart Rate (bpm)
                                            </TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                                Blood Pressure (mmHg)
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {healthData.map((data, index) => (
                                            <TableRow
                                                key={data.date.toLocaleDateString()}
                                                sx={{ 
                                                    '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {data.date.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell align="center">{data.glucose}</TableCell>
                                                <TableCell align="center">{data.sugar}</TableCell>
                                                <TableCell align="center">{data.heartrate}</TableCell>
                                                <TableCell align="center">{data.bloodpressure}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        
                        <Box className='record-card messages-section' sx={{ alignSelf: "stretch" }}>
                            <Typography variant="h6" gutterBottom>
                                Doctor Messages
                            </Typography>
                            <TableContainer className="table-container">
                                <Table stickyHeader size='small' aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell 
                                                sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                                            >
                                                Doctor
                                            </TableCell>
                                            <TableCell 
                                                sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                                            >
                                                Specialization
                                            </TableCell>
                                            <TableCell 
                                                align="left"
                                                sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                                            >
                                                Message
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {messageHistory.map((message, index) => (
                                            <TableRow
                                                key={message.id}
                                                sx={{ 
                                                    '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                }}
                                            >
                                                <TableCell component="th" scope="row" style={{ width: '25%', height: '80px' }} align="left">
                                                    {message.doctorProfile.firstName} {message.doctorProfile.lastName}
                                                </TableCell>
                                                <TableCell style={{ width: '25%' }} align="left">
                                                    {message.doctorProfile.specialization}</TableCell>
                                                <TableCell style={{ width: '75%' }} align="left">
                                                    {message.noteToPatient}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>

                    {/* Prescriptions */}
                    <Box className='record-card' sx={{ width: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                            Prescriptions
                        </Typography>
                        <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                            Medication
                                        </TableCell>
                                        <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                            Dosage
                                        </TableCell>
                                        <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                            Start Date
                                        </TableCell>
                                        <TableCell align="center" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                            End Date
                                        </TableCell>
                                        <TableCell 
                                            style={{ width: '33%' }} 
                                            align="center" 
                                            sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                                        >
                                            Remarks
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prescriptions.map((prescription) => (
                                        <TableRow
                                            key={prescription.name}
                                            sx={{ 
                                                '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {prescription.medication}
                                            </TableCell>
                                            <TableCell align="center">{prescription.dosage}</TableCell>
                                            <TableCell align="center">{prescription.startDate}</TableCell>
                                            <TableCell align="center">{prescription.endDate}</TableCell>
                                            <TableCell style={{ width: '33%' }} align="center">
                                                {prescription.remarks}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
};

export default DataCenter;
