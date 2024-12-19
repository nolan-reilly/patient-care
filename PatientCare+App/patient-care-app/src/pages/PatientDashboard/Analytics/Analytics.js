import React, { useEffect, useState } from "react";
import PatientSidebar from '../../../components/PatientSidebar/PatientSidebar';
import './Analytics.css';
import { Box, Divider, Typography, ToggleButtonGroup, ToggleButton, Button, Snackbar, Alert } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { getHealthData } from "../../../api/patientActions";
import { calculateHealthIndexScores } from "./statFunctions";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const Analytics = () => {
    // general statistics
    const [healthIndexScore, setHealthIndexScore] = useState(0);
    const [numberOfAlerts, setNumberOfAlerts] = useState(0);

    // total data for patient metrics
    const [time, setTime] = useState([]);
    const [glucoseHistory, setGlucoseHistory] = useState([]);
    const [heartRateHistory, setHeartRateHistory] = useState([]);
    const [bloodSugarHistory, setBloodSugarHistory] = useState([]);
    const [systolicHistory, setSystolicHistory] = useState([]);
    const [diastolicHistory, setDiastolicHistory] = useState([]);

    // health statistics objects
    const [glucoseAnalytics, setGlucoseAnalytics] = useState({});
    const [heartRateAnalytics, setHeartRateAnalytics] = useState({});
    const [bloodSugarAnalytics, setBloodSugarAnalytics] = useState({});
    const [bloodPressureAnalytics, setBloodPressureAnalytics] = useState({});

    // current data being displayed
    const [currentTime, setCurrentTime] = useState([]);
    const [currentGlucoseHistory, setCurrentGlucoseHistory] = useState([]);
    const [currentHeartRateHistory, setCurrentHeartRateHistory] = useState([]);
    const [currentBloodSugarHistory, setCurrentBloodSugarHistory] = useState([]);
    const [currentSystolicHistory, setCurrentSystolicHistory] = useState([]);
    const [currentDiastolicHistory, setCurrentDiastolicHistory] = useState([]);

    // states for range of data
    const [weekRangeActive, setWeekRangeActive] = useState(false);
    const [monthRangeActive, setMonthRangeActive] = useState(true);
    const [sixMonthRangeActive, setSixMonthRangeActive] = useState(false);
    const [yearRangeActive, setYearRangeActive] = useState(false);
    const [allTimeRangeActive, setAllTimeRangeActive] = useState(false);

    // state for data retrieval
    const [dataRetrieved, setDataRetrieved] = useState(false);
    const [filterDataReady, setFilterDataReady] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    useEffect(() => {
        retrieveHealthData();
    }, [])

    useEffect(() => {
        if (dataRetrieved) {
            filterData(30);
        }
    }, [dataRetrieved]);

    useEffect(() => {
        if (filterDataReady) {
            analyzeHealthData();
        }
    }, [filterDataReady]);

    // for testing, to remove later
    useEffect(() => {
        console.log('Glucose Analytics: ', glucoseAnalytics);
        console.log('Heart Rate Analytics: ', heartRateAnalytics);
        console.log('Blood Sugar Analytics: ', bloodSugarAnalytics);
        console.log('Blood Pressure Analytics: ', bloodPressureAnalytics);
    }, [glucoseAnalytics, heartRateAnalytics, bloodSugarAnalytics, bloodPressureAnalytics]);

    const retrieveHealthData = async () => {
        try {
            const data = await getHealthData();
            if (data === null) {
                return;
            }
            await parseHealthData(data);
            setDataRetrieved(true);
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const analyzeHealthData = async () => {
        const analyticData = calculateHealthIndexScores(
            currentGlucoseHistory, currentHeartRateHistory, 
            currentBloodSugarHistory, currentSystolicHistory, 
            currentDiastolicHistory);

        setHealthIndexScore(analyticData.overall.score);
        setNumberOfAlerts(analyticData.overall.alerts);

        setGlucoseAnalytics({
            score: analyticData.glucose.score,
            percent: analyticData.glucose.percent * 100,
            stdDev: analyticData.glucose.stdDev,
            alert: analyticData.glucose.alert
        });

        setHeartRateAnalytics({
            score: analyticData.heartRate.score,
            percent: analyticData.heartRate.percent * 100,
            stdDev: analyticData.heartRate.stdDev,
            alert: analyticData.heartRate.alert
        });

        setBloodSugarAnalytics({
            score: analyticData.bloodSugar.score,
            percent: analyticData.bloodSugar.percent * 100,
            stdDev: analyticData.bloodSugar.stdDev,
            alert: analyticData.bloodSugar.alert
        });

        setBloodPressureAnalytics({
            score: analyticData.bloodPressure.score,
            percent: analyticData.bloodPressure.percent * 100,
            stdDev: analyticData.bloodPressure.stdDev,
            alert: analyticData.bloodPressure.alert
        });
    }

    const parseHealthData = async (data) => {
        let glucose = [];
        let heart = [];
        let sugar = [];
        let systolic = [];
        let diastolic = [];
        let time = [];

        data.forEach(element => {
            glucose.push(element.glucoseLevel);
            heart.push(element.heartRate);
            sugar.push(element.bloodSugar);
            const [sys, dia] = element.bloodPressure.split('/').map(Number);
            systolic.push(sys);
            diastolic.push(dia);

            const date = new Date(element.dateTime);
            date.setHours(date.getHours() - 5);
            time.push(date);
        });

        setGlucoseHistory(glucose);
        setHeartRateHistory(heart);
        setBloodSugarHistory(sugar);
        setSystolicHistory(systolic);
        setDiastolicHistory(diastolic);
        setTime(time);
    }

    // FILTER THE DATA BASED ON THE RANGE SELECTED
    const filterData = (days) => {
        // -1 denotes all time
        if (days === -1) {
            setCurrentTime(time);
            setCurrentGlucoseHistory(glucoseHistory);
            setCurrentHeartRateHistory(heartRateHistory);
            setCurrentBloodSugarHistory(bloodSugarHistory);
            setCurrentSystolicHistory(systolicHistory);
            setCurrentDiastolicHistory(diastolicHistory);
            analyzeHealthData();
            return;
        }

        // else start filtering the data
        const rangeStartData = new Date();
        rangeStartData.setDate(rangeStartData.getDate() - days);

        const filteredGlucoseHistory = glucoseHistory.filter((_, index) => time[index] >= rangeStartData);
        const filteredHeartRateHistory = heartRateHistory.filter((_, index) => time[index] >= rangeStartData);
        const filteredBloodSugarHistory = bloodSugarHistory.filter((_, index) => time[index] >= rangeStartData);
        const filteredSystolicHistory = systolicHistory.filter((_, index) => time[index] >= rangeStartData);
        const filteredDiastolicHistory = diastolicHistory.filter((_, index) => time[index] >= rangeStartData);
        const filteredTime = time.filter((date) => date >= rangeStartData);

        setCurrentTime(filteredTime);
        setCurrentGlucoseHistory(filteredGlucoseHistory);
        setCurrentHeartRateHistory(filteredHeartRateHistory);
        setCurrentBloodSugarHistory(filteredBloodSugarHistory);
        setCurrentSystolicHistory(filteredSystolicHistory);
        setCurrentDiastolicHistory(filteredDiastolicHistory);

        setFilterDataReady(true);
    }

    const [selectedRange, setSelectedRange] = useState('1M');

    const handleRangeChange = (event, newRange) => {
    if (newRange !== null) {
        setSelectedRange(newRange);
        switch (newRange) {
        case '1W':
            handleWeekRangeInput();
            break;
        case '1M':
            handleMonthRangeInput();
            break;
        case '6M':
            handleSixMonthRangeInput();
            break;
        case '1Y':
            handleYearRangeInput();
            break;
        case 'All':
            handleAllTimeRangeInput();
            break;
        default:
            break;
        }
    }
    };


    // SETTING THE RANGE OF DATA TO DISPLAY
    const setAllToFalse = () => {
        setWeekRangeActive(false);
        setMonthRangeActive(false);
        setSixMonthRangeActive(false);
        setYearRangeActive(false);
        setAllTimeRangeActive(false);
    }

    const handleWeekRangeInput = () => {
        setAllToFalse();
        setWeekRangeActive(true);
        filterData(7);
    }

    const handleMonthRangeInput = () => {
        setAllToFalse();
        setMonthRangeActive(true);
        filterData(30);
    }

    const handleSixMonthRangeInput = () => {
        setAllToFalse();
        setSixMonthRangeActive(true);
        filterData(180);
    }

    const handleYearRangeInput = () => {
        setAllToFalse();
        setYearRangeActive(true);
        filterData(365);
    }

    const handleAllTimeRangeInput = () => {
        setAllToFalse();
        setAllTimeRangeActive(true);
        filterData(-1);
    }

    // might find a way to use alert on this page, but dont have to
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
            <Box className="dashboard-container">
                <Box className="flex-col">
                    {/* Health Index Score and Time Range Buttons */}
                    <Box className="flex underline">
                        <Box className="health-index-score">
                            <Typography variant="h5">Health Index Score:</Typography>
                            <Typography variant="h4">{healthIndexScore.toFixed(1)}</Typography>
                        </Box>
                        <Box className="time-range-buttons">
                            <ToggleButtonGroup color="primary" value={selectedRange} exclusive onChange={handleRangeChange}>
                                <ToggleButton value="1W">1W</ToggleButton>
                                <ToggleButton value="1M">1M</ToggleButton>
                                <ToggleButton value="6M">6M</ToggleButton>
                                <ToggleButton value="1Y">1Y</ToggleButton>
                                <ToggleButton value="All">All</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>

                    {/* Graphs */}
                    <Box className="metric-statistics">
                        {/* Glucose */}
                        <Box className="metric-card">
                            <Box className="metric-header">
                                <Typography variant="h6">Glucose</Typography>
                                {glucoseAnalytics?.alert ? (
                                        <PriorityHighIcon sx={{ 
                                            color: "rgba(255, 69, 69, 0.95)",
                                            fontSize: 20,
                                            animation: "shake 1s ease-in-out infinite",
                                            transition: 'transform 0.2s ease'
                                        }} />
                                    ) : (
                                        <ThumbUpIcon sx={{ 
                                            color: "rgba(67, 164, 124, 0.85)",
                                            fontSize: 20,
                                        }} />
                                )}
                            </Box>
                            <LineChart
                                xAxis={[{ 
                                    data: currentTime,
                                    scaleType: 'utc',
                                    valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                }]}
                                series={[{
                                    data: currentGlucoseHistory,
                                    showMark: false,
                                    color: glucoseAnalytics?.alert ? "rgba(255, 69, 69, 0.95)" : "rgba(67, 164, 124, 0.85)"
                                }]}
                                height={300}
                                {...{
                                    legend: { hidden: true },
                                    margin: { top: 10 }
                                }}
                            />
                            <Box className="metric-info" sx={{ justifyContent: "space-evenly" }}>
                                <Typography variant="body2">
                                    Index Score: {glucoseAnalytics?.score?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    % in Healthy Range: {glucoseAnalytics?.percent?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    Typical Deviation: {glucoseAnalytics?.stdDev?.toFixed(1)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Heart Rate */}
                        <Box className="metric-card">
                            <Box className="metric-header">
                                <Typography variant="h6">Heart Rate</Typography>
                                {heartRateAnalytics?.alert ? (
                                        <PriorityHighIcon sx={{ 
                                            color: "rgba(255, 69, 69, 0.95)",
                                            fontSize: 20,
                                            animation: "shake 1s ease-in-out infinite",
                                            transition: 'transform 0.2s ease'
                                        }} />
                                    ) : (
                                        <ThumbUpIcon sx={{ 
                                            color: "rgba(67, 164, 124, 0.85)",
                                            fontSize: 20,
                                        }} />
                                )}
                            </Box>
                            <LineChart
                                xAxis={[{ 
                                    data: currentTime,
                                    scaleType: 'utc',
                                    valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                }]}
                                series={[{
                                    data: currentHeartRateHistory,
                                    showMark: false,
                                    color: heartRateAnalytics?.alert ? "rgba(255, 69, 69, 0.95)" : "rgba(67, 164, 124, 0.85)"
                                }]}
                                height={300}
                                {...{
                                    legend: { hidden: true },
                                    margin: { top: 10 }
                                }}
                            />
                            <Box className="metric-info" sx={{ justifyContent: "space-evenly" }}>
                                <Typography variant="body2">
                                    Index Score: {heartRateAnalytics?.score?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    % in Healthy Range: {heartRateAnalytics?.percent?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    Typical Deviation: {heartRateAnalytics?.stdDev?.toFixed(1)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Blood Sugar */}
                        <Box className="metric-card">
                            <Box className="metric-header">
                                <Typography variant="h6">Blood Sugar</Typography>
                                {bloodSugarAnalytics?.alert ? (
                                        <PriorityHighIcon sx={{ 
                                            color: "rgba(255, 69, 69, 0.95)",
                                            fontSize: 20,
                                            animation: "shake 1s ease-in-out infinite",
                                            transition: 'transform 0.2s ease'
                                        }} />
                                    ) : (
                                        <ThumbUpIcon sx={{ 
                                            color: "rgba(67, 164, 124, 0.85)",
                                            fontSize: 20 
                                        }} />
                                )}
                            </Box>
                            <LineChart
                                xAxis={[{ 
                                    data: currentTime,
                                    scaleType: 'utc',
                                    valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                }]}
                                series={[{
                                    data: currentBloodSugarHistory,
                                    showMark: false,
                                    color: bloodSugarAnalytics?.alert ? "rgba(255, 69, 69, 0.95)" : "rgba(67, 164, 124, 0.85)"
                                }]}
                                height={300}
                                {...{
                                    legend: { hidden: true },
                                    margin: { top: 10 }
                                }}
                            />
                            <Box className="metric-info" sx={{ justifyContent: "space-evenly" }}>
                                <Typography variant="body2">
                                    Index Score: {bloodSugarAnalytics?.score?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    % in Healthy Range: {bloodSugarAnalytics?.percent?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    Typical Deviation: {bloodSugarAnalytics?.stdDev?.toFixed(1)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Blood Pressure */}
                        <Box className="metric-card">
                            <Box className="metric-header">
                                <Typography variant="h6">Blood Pressure</Typography>
                                {bloodPressureAnalytics?.alert ? (
                                        <PriorityHighIcon sx={{ 
                                            color: "rgba(255, 69, 69, 0.95)",
                                            fontSize: 20,
                                            animation: "shake 1s ease-in-out infinite",
                                            transition: 'transform 0.2s ease'
                                        }} />
                                    ) : (
                                        <ThumbUpIcon sx={{ 
                                            color: "rgba(67, 164, 124, 0.85)",
                                            fontSize: 20 
                                        }} />
                                )}
                            </Box>
                            <LineChart
                                xAxis={[{ 
                                    data: currentTime,
                                    scaleType: 'utc',
                                    valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                }]}
                                series={[
                                    { 
                                        label: 'Systolic',
                                        data: currentSystolicHistory,
                                        showMark: false,
                                        color: bloodPressureAnalytics.alert ? "rgba(255, 69, 69, 0.95)": 'rgba(67, 164, 124, 0.85)'
                                    },
                                    {
                                        label: 'Diastolic',
                                        data: currentDiastolicHistory,
                                        showMark: false,
                                        color: bloodPressureAnalytics.alert ? "rgba(255, 69, 69, 0.95)": 'rgba(47, 162, 193, 0.85)'
                                    }
                                ]}
                                height={300}
                                {...{
                                    legend: { hidden: true },
                                    margin: { top: 10 }
                                }}
                            />
                            <Box className="metric-info" sx={{ justifyContent: "space-evenly"}}>
                                <Typography variant="body2">
                                    Index Score: {bloodPressureAnalytics?.score?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    % in Healthy Range: {bloodPressureAnalytics?.percent?.toFixed(1)}
                                </Typography>
                                <Box sx={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', height: '24px' }} />
                                <Typography variant="body2">
                                    Typical Deviation: {bloodPressureAnalytics?.stdDev?.toFixed(1)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Analytics;
