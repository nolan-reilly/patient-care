import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, TextField, Alert, Snackbar, ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import './Login.css';
import { login } from '../../api/authService';
import Logo from "./PatientCare+.png";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// valid email pattern
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
    const navigate = useNavigate();

    // these are states of various variables that are needed for this page
    const [doctorActive, setDoctorActive] = useState(false);
    const [patientActive, setPatientActive] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [passValue, setPassValue] = useState('');

    const [disabled, setDisabled] = useState(true);
    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    const handleDoctorClick = (e) => {
        setDoctorActive(true);
        setPatientActive(false);
    }

    const handlePatientClick = (e) => {
        setPatientActive(true);
        setDoctorActive(false);
    }

    const handleEmailChange = (e) => {
        setEmailValue(e.target.value);

        isDisabled();
    };

    const handlePasswordChange = (e) => {
        setPassValue(e.target.value);
        isDisabled();
    };

    const isDisabled = () => {
        if (emailValue === '' || passValue === '') {
            setDisabled(true);
        }
        else {
            setDisabled(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // make sure either doctor or patient selection was made
        if (!doctorActive && !patientActive) {
            showAlert('warning', 'Please select whether you are a doctor or patient...');
            return;
        }
        // make sure all fields have been filled out
        if (!emailValue || !passValue) {
            showAlert('warning', 'Please fill out all input fields...');
            return;
        }
        // then make sure email is in correct format
        if (emailPattern.test(emailValue) === false) {
            showAlert('warning', 'Make sure to enter a valid email address...');
            return;
        }

        const user = doctorActive ? 'Doctor': 'Patient';
        // now can call to attempt a valid registration attempt
        try {
            await login(user, {
                username: emailValue,
                password: passValue
            });
            
            // add navigation to dashboard once working on it
            if (sessionStorage.getItem('role') === 'Patient' && user === 'Patient') {
                showAlert('success', 'Successful Patient login!');
                // delay navigation to dashboard for 2 seconds
                setTimeout(() => navigate('/patient-dashboard'), 2000);
            }
            else if (sessionStorage.getItem('role') === 'Doctor' && user === 'Doctor') {
                showAlert('success', 'Successful Doctor login!');
                // delay navigation to dashboard for 2 seconds
                setTimeout(() => navigate('/doctor-dashboard'), 2000);
            }
            else {
                showAlert('error', 'Invalid login credentials. Please try again...');
            }
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
        setTimeout(() => setAlert((prev) => ({ ...prev, open: false})), 3000);
    }

    const handleBack = (e) => { 
        e.preventDefault();
        navigate('/');
    }

    // Toggle Button Group Code
    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (event, newAlignment) => {
      setAlignment(newAlignment);
    };

    return (
        <div className="login-blob-bg">
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
            <Box className="container-sm flex-col gap-24">
                <Box className="flex">
                    <p className="nav-logo-text">PatientCare</p>
                    <img src={Logo} className="nav-logo-img" alt="Logo"/>
                </Box>
                {/* Weird bug with className here as class works */}
                <ToggleButtonGroup class="login-btn-group" color="primary" value={alignment} exclusive onChange={handleChange} aria-label="platform">
                    <Box className="flex">
                        <ToggleButton className="login-toggle-choice" value="doctor" onClick={handleDoctorClick}>
                            Doctor
                        </ToggleButton>

                        <ToggleButton className="login-toggle-choice" value="patient" onClick={handlePatientClick}>
                            Patient
                        </ToggleButton>
                    </Box>
                </ToggleButtonGroup>

                <TextField 
                        className="full-width"
                        id='outlined-required'
                        required
                        label='Email'
                        defaultValue={emailValue}
                        onChange={handleEmailChange}
                />

                <TextField 
                    className="full-width"
                    id='outlined-required'
                    required
                    label='Password'
                    type='password'
                    defaultValue={passValue}
                    onChange={handlePasswordChange}
                />

                <Button
                    className="full-width"
                    disabled={disabled}
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}>
                    Login
                </Button>
                
                <Button onClick={handleBack}>
                    Back
                    <ArrowBackIcon />
                </Button>  
            </Box>
        </div>
    );
};

export default Login;