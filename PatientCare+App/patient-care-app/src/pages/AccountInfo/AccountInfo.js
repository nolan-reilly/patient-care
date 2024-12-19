import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Autocomplete, Button, Alert, Snackbar } from '@mui/material';
import { fullDoctorRegistration } from '../../api/doctorActions';
import { fullPatientRegistration } from '../../api/patientActions';
import './AccountInfo.css';
import Logo from "./PatientCare+.png"

// use for form STATE INITIALS
const state_initials = [
    'AL: Alabama', 'AK: Alaska', 'AZ: Arizona', 'AR: Arkansas', 'CA: California', 
    'CO: Colorado', 'CT: Connecticut', 'DE: Delaware', 'DC: District of Columbia', 
    'FL: Florida', 'GA: Georgia', 'HI: Hawaii', 'ID: Idaho', 'IL: Illinois', 
    'IN: Indiana', 'IA: Iowa', 'KS: Kansas', 'KY: Kentucky', 'LA: Louisiana', 
    'ME: Maine', 'MD: Maryland', 'MA: Massachusetts', 'MI: Michigan', 
    'MN: Minnesota', 'MS: Mississippi', 'MO: Missouri', 'MT: Montana', 'NE: Nebraska', 
    'NV: Nevada', 'NH: New Hampshire', 'NJ: New Jersey', 'NM: New Mexico', 
    'NY: New York', 'NC: North Carolina', 'ND: North Dakota', 'OH: Ohio',
    'OK: Oklahoma', 'OR: Oregon', 'PA: Pennsylvania', 'RI: Rhode Island', 
    'SC: South Carolina', 'SD: South Dakota', 'TN: Tennessee', 'TX: Texas', 
    'UT: Utah', 'VT: Vermont', 'VA: Virginia', 'WA: Washington', 'WV: West Virginia', 
    'WI: Wisconsin', 'WY: Wyoming'
];

const AccountInfo = () => {
    // use for getting state and linking
    const navigate = useNavigate();

    // fields to fill out for both patient and doctor
    const userType = sessionStorage.getItem('role');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const email = sessionStorage.getItem('email');
    const [age, setAge] = useState(null);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');

    // doctor specific fields
    const [specialization, setSpecialization] = useState('');
    const [licenseNum, setLicenseNum] = useState('');

    // errors in form to look out for
    const [usernameError, setUsernameError] = useState(false);
    const [ageError, setAgeError] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [licenseError, setLicenseError] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    // check to make sure user has a session token, this is only way they should access page
    useEffect(() => {
        if (sessionStorage.getItem('token') === null) {
            navigate('/');
        }

        console.log(userType);
    }, [navigate]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);

        if (username.length > 10 || username.includes(' ')) {
            setUsernameError(true);
        }
        else {
            setUsernameError(false);
        }

        determineDisabled();
    }

    const handleFirstNameChange = (e) => {
        setFirstname(e.target.value);
        determineDisabled();
    }

    const handleLastNameChange = (e) => {
        setLastname(e.target.value);
        determineDisabled();
    }

    const handleAgeChange = (e) => {
        const checkAge = e.target.value
        if (checkAge < 1) {
            setAgeError(true);
        }
        else {
            setAgeError(false);
        }
        setAge(checkAge);
        determineDisabled();
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
        determineDisabled();
    }

    const handleCityChange = (e) => {
        setCity(e.target.value);
        determineDisabled();
    }

    const handleStateChange = (e) => {
        setState(e.target.value);
        determineDisabled();
    }

    const handleCountryChange = (e) => {
        setCountry(e.target.value);
        determineDisabled();
    }

    const handleSpecializationChange = (e) => {
        setSpecialization(e.target.value);
        determineDisabled();
    }

    const handleLicenseChange = (e) => {
        setLicenseNum(e.target.value);
        determineDisabled();
    }

    const determineDisabled = (e) => {
        setDisabled(!(
            username !== '' && username.length <= 10 && 
            firstname !== '' &&
            lastname !== '' &&
            age > 0 &&
            address !== '' &&
            city !== '' &&
            state !== '' &&
            country !== ''
        ))

        if (userType === 'Doctor' && 
            (specialization === '' || licenseNum.length === '')) {
                setDisabled(true);
            }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let info = {};
        if (userType === 'Patient') {
            info = {
                UserName: username,
                FirstName: firstname,
                LastName: lastname,
                Email: email,
                Age: age,
                City: city,
                State: state,
                Address: address,
                Country: country
            }
        }
        else {
            if (licenseNum.length != 10) {
                showAlert('warning', 'Please enter a valid length license number (10)...');
                return;
            }

            info = {
                userName: username,
                firstName: firstname,
                lastName: lastname,
                email: email,
                age: age,
                city: city,
                state: state,
                address: address,
                country: country,
                specialization: specialization,
                licenseNumber: licenseNum
            }
        }

        try {
            if (userType === 'Doctor') {
                await fullDoctorRegistration(info);

                showAlert('success', 'Doctor registration successful!');

                // delay navigation to doctor dashboard for UIX
                setTimeout(() => navigate('/doctor-dashboard'), 2000);
            }
            else {
                await fullPatientRegistration(info);

                showAlert('success', 'Patient registration successful!');

                // delay navigation to patient dashboard for UIX
                setTimeout(() => navigate('/patient-dashboard'), 2000);
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
    }

    const showAlert = (type, message) => {
        setAlert({ open: true, type: type, message: message});
        setTimeout(() => setAlert((prev) => ({ ...prev, open: false})), 3000);
    }

    // form is same for both patient and doctor
    return (
        <div className="account-info-blob-bg">
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

                <TextField
                    error={usernameError}
                    className='full-width'
                    required
                    id='outline-required'
                    label='Username'
                    defaultValue={username}
                    onChange={handleUsernameChange}
                    color='primary'
                />

                <Box className="flex gap-12">
                    <TextField 
                        className="full-width"
                        required
                        id='outlined-required'
                        label='First Name'
                        defaultValue={firstname}
                        onChange={handleFirstNameChange}
                        color='primary'
                    />

                    <TextField
                        className='full-width'
                        required
                        id='outlined-required'
                        label='Last Name'
                        defaultValue={lastname}
                        onChange={handleLastNameChange}
                        color='primary'
                    />

                    <TextField
                        className='half-width'
                        error={ageError}
                        required
                        id='outlined-required'
                        label='Age'
                        defaultValue={age}
                        onChange={handleAgeChange}
                        color='primary'
                    />
                </Box>

                <Box className="flex gap-12">
                    <TextField
                        className='full-width'
                        required
                        id='outlined-required'
                        label='Street Address'
                        defaultValue={address}
                        onChange={handleAddressChange}
                        color='primary'
                    />

                    <TextField
                        className='full-width'
                        required
                        id='outlined-required'
                        label='City'
                        defaultValue={city}
                        onChange={handleCityChange}
                        color='primary'
                    />
                </Box>

                {/* Removed the Autocomplete component as it has weird features */}
                <Box className="flex gap-12">
                    <TextField
                        id='outlined-required'
                        className="full-width"
                        label="State"
                        defaultValue={state}
                        required
                        onChange={handleStateChange}
                    />

                    <TextField
                        className='full-width'
                        required
                        id='outlined-required'
                        label='Country'
                        defaultValue={country}
                        onChange={handleCountryChange}
                        color='primary'
                    />
                </Box>

                {userType === 'Doctor' && (
                    <Box className="flex gap-12">
                        <TextField
                            className='full-width'
                            required
                            id='outlined-required'
                            label='Specialization'
                            defaultValue={specialization}
                            onChange={handleSpecializationChange}
                            color='primary'
                        />

                        {/* License number must be 10 characters long */}
                        <TextField
                            className='full-width'
                            required
                            error={licenseError}
                            id='outlined-required'
                            label='License Number'
                            defaultValue={licenseNum}
                            onChange={handleLicenseChange}
                            color='primary'
                        />
                    </Box>
                )}

                <Button
                    className='full-width'
                    disabled={disabled}
                    variant='contained'
                    onClick={handleSubmit}   
                >
                    Submit
                </Button>
            </Box>
        </div>
    );
}

export default AccountInfo;
