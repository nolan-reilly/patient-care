import React, { useEffect, useState } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar/DoctorSidebar';
import { Typography, Box, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, TextField, Button, Snackbar, Alert } from '@mui/material';
import { addDoctorNote, getMyPatientsData } from '../../../api/doctorActions';
import './ClientList.css';
import Prescription from '../../Prescription/Prescription';

const ClientList = () => {
    const [patientList, setPatientList] = useState([]);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [currentPatientHealth, setCurrentPatientHealth] = useState([]);
    const [currentPatientTime, setCurrentPatientTime] = useState([]);
    const [note, setNote] = useState("");

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    useEffect(() => {
        const retrievePatientData = async () => {
            try {
                const patientData = await getMyPatientsData();
                setPatientList(patientData);
            }
            catch (error) {
                console.log(error.message)
            }
        };

        retrievePatientData();
    }, []); // Empty dependency array

    const updatePatient = (patient) => {
        setCurrentPatient(patient);
        setCurrentPatientHealth(patient.healthData.reverse());
        let time = [];

        currentPatientHealth.forEach(element => {
            const date = new Date(element.dateTime);
            date.setHours(date.getHours() - 5);
            time.push(date);
        })

        setCurrentPatientTime(time.reverse());
    }

    const handleNoteSend = (e) => {
        if (!currentPatient) {
            showAlert('warning', 'Select a Patient...')
            return;
        }
        if (note === '') {
            showAlert('warning', 'Fill out Note...')
            return;
        }

        try {
            addDoctorNote({
                NoteToPatient: note,
                patientEmail: currentPatient.email
            });
            setNote('');
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

    const handleNoteChange = (e) => {
        setNote(e.target.value);
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
            <DoctorSidebar />
            <Box className="dashboard-container">
                <Box className="flex-col gap-24" sx={{ alignItems: 'stretch', width: '100%' }}>
                    <Box className="flex gap-24">
                        {/* Client List Card */}
                        <Box className="record-card" sx={{ flex: 1 }}>
                            <Typography variant="h5" className="underline" gutterBottom>
                                Client List
                            </Typography>
                            <Box className="client-list" sx={{
                                minHeight: "45vh",
                                maxHeight: '45vh',
                                overflow: 'auto',
                                width: '100%'
                            }}>
                                {patientList.map(patient => (
                                    <Box 
                                        key={patient.email}
                                        onClick={() => updatePatient(patient)}
                                        className="patient-item"
                                        sx={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}
                                    >
                                        <Typography sx={{ width: '100%' }}>
                                            {patient.firstName} {patient.lastName}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Client Details Card */}
                        <Box className="record-card" sx={{ flex: 2 }}>
                            <Typography variant="h5" className="underline" gutterBottom>
                                {currentPatient 
                                    ? `${currentPatient.firstName} ${currentPatient.lastName} (${currentPatient.email})`
                                    : 'Select Patient'
                                }
                            </Typography>
                            <Box className="flex gap-24">
                                <Box className="flex-col" sx={{ flex: 2 }}>
                                    <TableContainer sx={{ minHeight: '45vh', maxHeight: "45vh", overflow: 'auto' }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">S/N</TableCell>
                                                    <TableCell align="center">Glucose (mg/dL)</TableCell>
                                                    <TableCell align="center">Sugar (mg/dL)</TableCell>
                                                    <TableCell align="center">Heart Rate (bpm)</TableCell>
                                                    <TableCell align="center">Blood Pressure (mmHg)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {currentPatientHealth.map((data, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell align="center">{data.glucoseLevel}</TableCell>
                                                        <TableCell align="center">{data.bloodSugar}</TableCell>
                                                        <TableCell align="center">{data.heartRate}</TableCell>
                                                        <TableCell align="center">{data.bloodPressure}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                                <Box className="flex-col gap-24" sx={{ flex: 1, alignSelf: "start" }}>
                                    <TextField
                                        fullWidth
                                        label="Note"
                                        multiline
                                        rows={4}
                                        value={note}
                                        onChange={handleNoteChange}
                                    />
                                    <Button 
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleNoteSend}
                                        sx={{ height: '48px' }}
                                    >
                                        Send
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="record-card" sx={{ width: "100%"}}>
                        <Prescription patientInfo={currentPatient} />
                    </Box>
                            
                </Box>
            </Box>
        </Box>
    )
}

export default ClientList;
