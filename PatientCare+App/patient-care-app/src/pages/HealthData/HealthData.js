import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

function createHealthData(glucoseLevel, sugarLevel, heartRate, bloodPressure) {
  return {glucoseLevel, sugarLevel, heartRate, bloodPressure };
}

const rows = [
    createHealthData('100', '200', '80', '120/80'),
    createHealthData('120', '220', '90', '130/90'),
    createHealthData('110', '210', '85', '125/85'),
    createHealthData('105', '205', '82', '122/82'),
    createHealthData('115', '215', '87', '127/87'),
    createHealthData('125', '225', '92', '132/92'),
    createHealthData('130', '230', '95', '135/95'),
    createHealthData('135', '235', '97', '137/97'),
    createHealthData('140', '240', '100', '140/100'),
    createHealthData('145', '245', '105', '145/105')
];

const HealthData = () => {
  return (
    <Box sx={{ maxWidth: '600px', marginLeft: '20px' }}>
    <TableContainer component={Paper} 
        sx={{maxHeight: '300px', overflowY: 'auto'}}
    >
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" width={40}>S/N</TableCell>
            <TableCell align="center" width={100}>Glucose Level</TableCell>
            <TableCell align="center" width={100}>Sugar Level</TableCell>
            <TableCell align="center" width={100}>Heart Rate&nbsp;(SI)</TableCell>
            <TableCell align="center" width={100}>Blood Pressure&nbsp;(SI)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{index+1}</TableCell>
              <TableCell align="center">{row.glucoseLevel}</TableCell>
              <TableCell align="center">{row.sugarLevel}</TableCell>
              <TableCell align="center">{row.heartRate}</TableCell>
              <TableCell align="center">{row.bloodPressure}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}

export default HealthData;