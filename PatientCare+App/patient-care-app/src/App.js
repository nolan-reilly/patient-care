//import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import AccountInfo from './pages/AccountInfo/AccountInfo';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import Payroll from './pages/DoctorDashboard/Payroll/Payroll';
import Theme from './components/Theme/Theme';
import './App.css';
import ViewDoctors from './pages/PatientDashboard/ViewDoctors/ViewDoctors';
import Task from './pages/Task/Task';
import Analytics from './pages/PatientDashboard/Analytics/Analytics';
import UrgentCare from './pages/DoctorDashboard/UrgentCare/UrgentCare';
import ClientList from './pages/DoctorDashboard/ClientList/ClientList';
import PatientProfile from './pages/PatientDashboard/Profile/PatientProfile';
import DoctorProfile from './pages/DoctorDashboard/Profile/DoctorProfile';
import DataCenter from './pages/PatientDashboard/DataCenter/DataCenter';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/account-info" element={<AccountInfo />} />
            <Route path="/login" element={<Login />} />
            
            <Route path='/patient-dashboard' element={<PatientDashboard />} />
            <Route path='/patient-dashboard/doctors' element={<ViewDoctors />} />
            <Route path='/patient-dashboard/analytics' element={<Analytics />} />
            <Route path='/patient-dashboard/profile' element={<PatientProfile />} />
            <Route path='/patient-dashboard/record-center' element={<DataCenter />} />

            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-dashboard/payroll' element={<Payroll />} />
            <Route path='/doctor-dashboard/task' element={<Task />} />
            <Route path='/doctor-dashboard/urgent-care' element={<UrgentCare />} />
            <Route path='/doctor-dashboard/client' element={<ClientList />} />
            <Route path='/doctor-dashboard/profile' element={<DoctorProfile />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
