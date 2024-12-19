import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, TextField, Alert, Snackbar, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { submitHealthData, getHealthData } from '../../api/patientActions';
import './PatientDashboard.css';
import PatientSidebar from '../../components/PatientSidebar/PatientSidebar';
import ChatBot from '../../components/ChatBot/ChatBot'

const env = "prod"; // change to 'prod' for production
const bloodPressureRegex = new RegExp("[0-9]+\/[0-9]+$");

const PatientDashboard = () => {
    const navigate = useNavigate();

    // field for health data input
    const [glucoseLevel, setGlucoseLevel] = useState(null);
    const [heartRate, setHeartRate] = useState(null);
    const [bloodSugar, setBloodSugar] = useState(null);
    const [bloodPressure, setBloodPressure] = useState(null);

    // lists for health data to be graphed
    const [glucoseHistory, setGlucoseHistory] = useState([]);
    const [heartRateHistory, setHeartRateHistory] = useState([]);
    const [bloodSugarHistory, setBloodSugarHistory] = useState([]);
    const [systolicHistory, setSystolicHistory] = useState([]);
    const [diastolicHistory, setDiastolicHistory] = useState([]);
    const [time, setTime] = useState([]);

    // storing the last data recorded
    const [lastData, setLastData] = useState({});
    // error checking for submission attempt
    const [enterDisabled, setEnterDisabled] = useState(true);
    // track if health data exists
    const [dataExists, setDataExists] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    // check to make sure user has been logged in
    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('role') !== 'Patient') {
            navigate('/');
        }
    }, [])

    const retrieveHealthData = async () => {
        try {
            const data = await getHealthData();

            if (data === null) {
                setDataExists(false);
                return;
            }
    
            setDataExists(true);
            parseHealthData(data); 
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const parseHealthData = (data) => {
        let glucose = [];
        let heart = [];
        let sugar = [];
        let systolic = [];
        let diastolic = [];
        let time = [];

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate()-7);

        data.forEach(element => {
            const date = new Date(element.dateTime);
            date.setHours(date.getHours() - 5);
            
            if (date >= sevenDaysAgo) {
                glucose.push(element.glucoseLevel);
                heart.push(element.heartRate);
                sugar.push(element.bloodSugar);
                const [sys, dia] = element.bloodPressure.split('/').map(Number);
                systolic.push(sys);
                diastolic.push(dia);
                time.push(date);
            }
        });

        setGlucoseHistory(glucose);
        setHeartRateHistory(heart);
        setBloodSugarHistory(sugar);
        setSystolicHistory(systolic);
        setDiastolicHistory(diastolic);
        setTime(time);

        setLastData({
            glucose: glucoseHistory[glucoseHistory.length - 1],
            heartRate: heartRateHistory[heartRateHistory.length - 1],
            bloodSugar: bloodSugarHistory[bloodSugarHistory.length - 1],
            bloodPressure: `${systolicHistory[systolicHistory.length - 1]}/${diastolicHistory[diastolicHistory.length - 1]}`
        });
    }

    useEffect(() => {
        retrieveHealthData();

        // Set up an interval to fetch data every 10 seconds (10000 ms)
        const intervalId = setInterval(() => {
            retrieveHealthData();
        }, 30000); // 60 seconds

        console.log(glucoseHistory);
    
        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [retrieveHealthData])

    const checkEntries = () => {
        setEnterDisabled(!(glucoseLevel > 0 && heartRate > 0 &&
                           bloodSugar > 0 && bloodPressure !== null));
    }

    // handle changes to states on input
    const handleGlucoseChange = (e) => {
        setGlucoseLevel(e.target.value);
        checkEntries();
    }

    const handleHeartRateChange = (e) => {
        setHeartRate(e.target.value);
        checkEntries();
    }

    const handleBloodSugarChange = (e) => {
        setBloodSugar(e.target.value);
        checkEntries();
    }

    const handleBloodPressureChange = (e) => {
        setBloodPressure(e.target.value);
        checkEntries();
    }

    // handle the submission of form
    const handleDataSubmit = async (e) => {
        e.preventDefault();

        // make final checks for valid data entry
        if (glucoseLevel === null || heartRate === null ||
            bloodSugar === null || bloodPressure === null
        ) {
            showAlert('warning', 'Please fill out all input fields...');
        }

        if (glucoseLevel < 0 || heartRate < 0 || 
            bloodSugar < 0
        ) {
            showAlert('warning', 'Please enter non-negative values...');
        }

        if (bloodPressureRegex.test(bloodPressure) === false) {
            showAlert('warning', 'Please format blood pressure correctly. Ex: xxx/xx');
        }

        // format the data into the necessary json
        const data = {
            glucoseLevel: glucoseLevel,
            heartRate: heartRate,
            bloodSugar: bloodSugar,
            bloodPressure: bloodPressure
        };

        // attempt api request, let user know
        try {
            await submitHealthData(data);

            showAlert('success', 'Health data submitted successfully!');
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
            <PatientSidebar />
            <ChatBot lastHealthData={lastData} />
            <Box className="dashboard-container">
                <Box className='patient-home-card flex-col gap-32'>
                    <Typography className="underline" variant="h5" component="h2">
                        Input Health Data
                    </Typography>

                    <Box className="full-width">
                        <Typography variant="caption" color="textSecondary" gutterBottom>
                            Healthy Range: 70-100 mg/dL
                        </Typography>
                        <TextField
                            className="full-width"
                            id='glucose'
                            label='Glucose Level'
                            defaultValue={glucoseLevel}
                            onChange={handleGlucoseChange}
                        />
                    </Box>

                    <Box className="full-width">
                        <Typography variant="caption" color="textSecondary" gutterBottom>
                            Healthy Range: 60-100 bpm
                        </Typography>
                        <TextField 
                            className="full-width"
                            id='heart-rate'
                            label='Heart Rate'
                            defaultValue={heartRate}
                            onChange={handleHeartRateChange}
                        />
                    </Box>

                    <Box className="full-width">
                        <Typography variant="caption" color="textSecondary" gutterBottom>
                            Healthy Range: 70-100 mg/dL
                        </Typography>
                        <TextField
                            className="full-width"
                            id='blood-sugar'
                            label='Blood Sugar'
                            defaultValue={bloodSugar}
                            onChange={handleBloodSugarChange}
                        />
                    </Box>

                    <Box className="full-width">
                        <Typography variant="caption" color="textSecondary" gutterBottom>
                            Healthy Range: 120/80 mmHg
                        </Typography>
                        <TextField
                            className="full-width"
                            id='blood-pressure'
                            label='Blood Pressure'
                            defaultValue={bloodPressure}
                            onChange={handleBloodPressureChange}
                        />
                    </Box>

                    <Button
                        className="full-width"
                        disabled={enterDisabled}
                        variant='contained'
                        onClick={handleDataSubmit}
                    >
                        Enter
                    </Button>
                </Box>
                
                {dataExists && (
                    <Box className='graphs'>
                        <Box className='graph-row'>
                            <Box className='graph flex-col'>
                                <h4 className="graph-header">Glucose (mg/dL)</h4>
                                <LineChart
                                    xAxis={[{ 
                                        data: time,
                                        dataKey: 'Time',
                                        scaleType: 'utc',
                                        label: 'Date',
                                        valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })
                                    }]}
                                    series={[{ 
                                        data: glucoseHistory,
                                        showMark: false
                                    }]}
                                    {...{
                                        legend: {hidden: true},
                                        margin: {top: 10}
                                    }}
                                />
                            </Box>
                            <Box className='graph'>
                                <h4 className="graph-header">Heart Rate (bpm)</h4>
                                <LineChart
                                    xAxis={[{ 
                                        label: 'Date',
                                        data: time,
                                        dataKey: 'Time',
                                        scaleType: 'utc',
                                        valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })
                                    }]}
                                    series={[{ 
                                        data: heartRateHistory,
                                        showMark: false
                                    }]}
                                    {...{
                                        legend: {hidden: true},
                                        margin: {top: 10}
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box className='graph-row'>
                            <Box className='graph'>
                                <h4 className="graph-header">Blood Sugar (mg/dL)</h4>
                                <LineChart
                                    xAxis={[{ 
                                        data: time,
                                        dataKey: 'Time',
                                        scaleType: 'utc',
                                        label: 'Date',
                                        valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })
                                    }]}
                                    series={[{ 
                                        data: bloodSugarHistory,
                                        showMark: false
                                    }]}
                                    {...{
                                        legend: {hidden: true},
                                        margin: {top: 10}
                                    }}
                                />
                            </Box>
                            <Box className='graph'>
                                <h4 className="graph-header">Blood Pressure (Sys/Dia)</h4>
                                <LineChart
                                    xAxis={[{ 
                                        data: time,
                                        dataKey: 'Time',
                                        scaleType: 'utc',
                                        label: 'Date',
                                        valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })
                                    }]}
                                    series={[
                                        { 
                                            label: 'Systolic',
                                            data: systolicHistory,
                                            showMark: false
                                        },
                                        {
                                            label: 'Diastolic',
                                            data: diastolicHistory,
                                            showMark: false
                                        }
                                    ]}
                                    {...{
                                        legend: {hidden: true},
                                        margin: {top: 10}
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default PatientDashboard;