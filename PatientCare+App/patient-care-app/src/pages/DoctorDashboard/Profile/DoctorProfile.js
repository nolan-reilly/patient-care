import React, { useEffect, useState } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar/DoctorSidebar';
import { Box, TextField, Snackbar, Alert } from '@mui/material';
import { getDoctorProfileInfo } from '../../../api/doctorActions';

const DoctorProfile = () => {
    const [username, setUsername] = useState("user_name");
    const [firstname, setFirstname] = useState("first_name");
    const [lastname, setLastname] = useState("last_name");
    const [email, setEmail] = useState("email@email.com")
    const [age, setAge] = useState(21);
    const [city, setCity] = useState("Chicago");
    const [state, setState] = useState("Illinois");
    const [address, setAddress] = useState("12345 Halsted");
    const [country, setCountry] = useState("United States");
    const [specialization, setSpecialization] = useState("Oncology");
    const [licenseNumber, setLicenseNumber] = useState("XX-00000-XX");

    const [alert, setAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    // on load get the profile info from api call
    useEffect(() => {
        const setProfileInfo = async () => {
            const profile = await getDoctorProfileInfo();

            setUsername(profile.userName);
            setFirstname(profile.firstName);
            setLastname(profile.lastName);
            setEmail(profile.email);
            setAge(profile.age);
            setCity(profile.city);
            setState(profile.state);
            setAddress(profile.address);
            setCountry(profile.country);
            setSpecialization(profile.specialization);
            setLicenseNumber(profile.licenseNumber);
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
        <div className='entire-page'>
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
            <DoctorSidebar className='sidebar' />
            <Box 
                className='view-profile-content'
                sx={{ borderRadius: '5px', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)', margin: '15vh auto auto auto', display: 'flex',
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
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                    <TextField label='Specialization' value={specialization} disabled sx={{ width: '58%' }} />
                    <TextField label='License Number' value={licenseNumber} disabled sx={{ width: '40%' }} />
                </Box>
            </Box>
        </div>
    );
}

export default DoctorProfile;
