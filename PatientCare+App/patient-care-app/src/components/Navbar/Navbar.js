import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Stack, Box } from '@mui/material';
import './Navbar.css';
import Logo from "./PatientCare+.png";

// Icon imports
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const Navbar = () => {
    const navigate = useNavigate();

    const handleRegister = (e) => {
        navigate('/register');
    }

    const handleLogin = (e) => {
        navigate('/login');
    }

    return (
        <div>
            <nav>
                <Box className="flex">
                    {/* Nav-logo */}
                    <Link to='/' className="flex nav-link">
                        <p className="nav-logo-text">PatientCare</p>
                        <img src={Logo} className="nav-logo-img" alt="Logo"/>
                    </Link>

                    {/* Buttons container */}
                    <Stack spacing={2} direction="row">
                        <Button>About Us</Button>
                        <Button onClick={handleLogin}>
                            Log in
                            <LoginIcon />
                        </Button>



                        <Button onClick={handleRegister}>
                            Register
                            <AppRegistrationIcon />
                        </Button>
                    </Stack>
                </Box>
            </nav>

            <Divider />
        </div>
    );
;}

export default Navbar;