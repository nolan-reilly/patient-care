import React, { useState, useEffect } from 'react';
import './PatientProfile.css';
import PatientSidebar from '../../../components/PatientSidebar/PatientSidebar';
import { Box, TextField, Snackbar, Alert } from '@mui/material';
import { getPatientProfileInfo } from '../../../api/patientActions';

const PatientProfile = () => {
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("")
    const [age, setAge] = useState(0);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    // on load get the profile info from api call
    useEffect(() => {
        const setProfileInfo = async () => {
            const profile = await getPatientProfileInfo();

            console.log(profile);

            setUsername(profile.userName);
            setFirstname(profile.firstName);
            setLastname(profile.lastName);
            setEmail(profile.email);
            setAge(profile.age);
            setCity(profile.city);
            setState(profile.state);
            setAddress(profile.address);
            setCountry(profile.country);
        };  

        try {
            setProfileInfo();
        }
        catch (error) {
            if (error.message === "Failed to fetch") {
                showAlert('error', 'Unable to connect to the server. Please check your internet connection or try again later.')
            }
            else {
                showAlert('error', error.message);
            }
        }
    }, []);

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
                <Box 
                    className='view-profile-content'
                    sx={{ borderRadius: '5px', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)', margin: '18vh auto auto auto', display: 'flex',
                        flexDirection: 'column', padding: '60px 45px', gap: '30px', width: '50%'
                    }}
                >
                    <h2>Profile Information</h2>
                    <Box 
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}
                    >
                        <TextField label='Username' value={username} disabled sx={{ width: '41%' }}/>
                        <TextField label='Email' value={email} disabled sx={{ width: '57%' }}/>
                    </Box>
                    <Box 
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                    >
                        <TextField label='First Name' value={firstname} disabled sx={{ width: '44%' }} />
                        <TextField label='Last Name' value={lastname} disabled sx={{ width: '44%' }} />
                        <TextField label='Age' value={age} disabled sx={{ width: '10%' }} />
                    </Box>
                    <Box 
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                    >
                        <TextField label='Street Address' value={address} disabled sx={{ width: '59%' }} />
                        <TextField label='City' value={city} disabled sx={{ width: '39%' }} />
                    </Box>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                    >
                        <TextField label='State' value={state} disabled sx={{ width: '52%' }} />
                        <TextField label='Country' value={country} disabled sx={{ width: '46%' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default PatientProfile;
