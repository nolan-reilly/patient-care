import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { register } from '../../api/authService';
import { Button, TextField, Snackbar, Alert, ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import './Register.css';

import Logo from "./PatientCare+.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// make global regex pattern of email to be used multiple times
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Register = () => {
    const navigate = useNavigate();

    const [doctorActive, setDoctorActive] = useState(false);
    const [patientActive, setPatientActive] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [confirmValue, setConfirmValue] = useState('');

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

    const handleConfirmationChange = (e) => {
        setConfirmValue(e.target.value);

        isDisabled();
    };

    const isDisabled = () => {
        if ((!doctorActive && !patientActive) ||
            (!emailValue || !passValue || !confirmValue)) {
                setDisabled(true);
        }
        else {
            setDisabled(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // make sure the email entered matches the regex
        if (emailPattern.test(emailValue) === false) {
            showAlert('warning', 'Make sure to entere a valid email address...');
            return;
        }

        // make sure that both password inputs are matching
        if (passValue !== confirmValue) {
            showAlert('warning', 'Make sure the passwords you entered match...')
            return;
        }

        const user = doctorActive ? 'Doctor': 'Patient';
        // attempt this, and try to catch any api errors for this attempt
        try {
            // now can call to attempt a valid registration attempt
            await register({
                username: emailValue,
                email: emailValue,
                password: passValue,
                confirmPassowrd: confirmValue,
                role: user
            });

            showAlert('success', 'Account registration successful!');

            // Delay navigation to account info page, for UIX
            setTimeout(() => navigate('/register/account-info'), 2000);
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
        <div className="register-blob-bg">
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
                {/* Weird Bug here in which class works but className doesn't? */}
                <ToggleButtonGroup class="register-btn-group" color="secondary" value={alignment} exclusive onChange={handleChange} aria-label="platform">
                    <Box className="flex">
                        <ToggleButton className="register-toggle-choice" value="doctor" onClick={handleDoctorClick}>
                            Doctor
                        </ToggleButton>

                        <ToggleButton className="register-toggle-choice" value="patient" onClick={handlePatientClick}>
                            Patient
                        </ToggleButton>
                    </Box>
                </ToggleButtonGroup>

                <TextField 
                        className="full-width"
                        color="secondary"
                        id='outlined-required'
                        required
                        label='Email'
                        defaultValue={emailValue}
                        onChange={handleEmailChange}
                />

                <TextField 
                    className="full-width"
                    color="secondary"
                    id='outlined-required'
                    required
                    label='Password'
                    type='password'
                    defaultValue={passValue}
                    onChange={handlePasswordChange}
                />

                <TextField
                    className="full-width"
                    color="secondary"
                    id='outlined-required'
                    required
                    label='Confirm Password'
                    type='password'
                    defaultValue={confirmValue}
                    onChange={handleConfirmationChange}
                />

                <Button
                    className="full-width"
                    disabled={disabled}
                    variant='contained'
                    color='secondary'
                    onClick={handleSubmit}>
                    Register
                </Button>
                
                <Button color='secondary' onClick={handleBack}>
                    Back
                    <ArrowBackIcon />
                </Button>  
            </Box>
        </div>
    );
};

export default Register;
