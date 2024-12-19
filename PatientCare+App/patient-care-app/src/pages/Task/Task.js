import * as React from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../../components/DoctorSidebar/DoctorSidebar';
import TaskComponent from "../../components/Task/Task.js";

// The todo list currently has no functionality associated with it
// just for show
const Task = () => {
  return (
    <Box className="dashboard-bg">
      <Sidebar />
      <Box className="dashboard-container">
        <TaskComponent />
      </Box>
    </Box>
  );
}

export default Task;