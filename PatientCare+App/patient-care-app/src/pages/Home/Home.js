import React from 'react';
import { Container, Box, Button, Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import Hospital from "./hospital.png"
import Grid from '@mui/material/Grid2';

// Icon imports
import TimelineIcon from '@mui/icons-material/Timeline';
import ChatIcon from '@mui/icons-material/Chat';
import MedicationIcon from '@mui/icons-material/Medication';

const Home = () => {
    return (
        <div className="page-container">
            <Container maxwidth="sm">
                <Navbar />

                <Box className="hero-section mt-md">
                    <Grid container spacing={4} alignItems="center">
                        {/* Hero Content */}
                        <Grid item size={6}>
                            <Box className="hero-content">
                                <Typography variant="h4" component="h4" gutterBottom>
                                    Comprehensive Health Monitoring at Your Fingertips
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Our app empowers you to easily track vital health metrics—heart rate, glucose, blood pressure, and blood sugar levels—all in one place. Stay informed with real-time updates, receive daily health insights, and seamlessly share your results with healthcare professionals for better, proactive care.
                                </Typography>
                                <Button className="md-btn" variant="contained">Sign Up Today</Button>
                            </Box>
                        </Grid>

                        {/* Hero Image */}
                        <Grid item size={6} sx={{ textAlign: "right" }}>
                            <Box className="hero-img">
                                <img src={Hospital} alt="Hospital" />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Box images */}
                <Box className="flex mt-lg mb-sm gap-24">
                    <Grid className="grid" container spacing={2}>
                        <Grid item size={4}>
                            <Card className="card full-height">
                                <CardHeader title="Vitals Monitoring" />
                                <TimelineIcon className="card-icon" />
                                <CardContent className="card-content">
                                    <Typography>
                                        Easily track heart rate, blood pressure, glucose, and blood sugar trends in real-time. Receive timely reminders to measure and log your vitals.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button className="card-btn" variant="contained">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        
                        <Grid item size={4}>
                            <Card className="card full-height">
                                <CardHeader title="Doctor Communication" />
                                <ChatIcon className="card-icon" />
                                <CardContent className="card-content">
                                    <Typography>
                                        Share your health data with your doctor through automatic reports. Keep your doctor updated with the latest health summaries.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button className="card-btn" variant="contained">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        
                        <Grid item size={4}>
                            <Card className="card full-height">
                                <CardHeader title="Health Ratings" />
                                <MedicationIcon className="card-icon" />
                                <CardContent className="card-content">
                                    <Typography>
                                        Rate your health daily and get tailored wellness tips. Monitor your progress and stay motivated to reach health goals.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button className="card-btn" variant="contained">Learn More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid >
                </Box>
            </Container>
            <div className="wave-background"></div>
        </div>
    );
};

export default Home;
