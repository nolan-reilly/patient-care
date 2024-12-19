import React, {useEffect, useState} from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { getDoctorUrgentCareList } from '../../../api/doctorActions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


const UrgentCareTable = ({ refreshKey }) => {

    const [urgentCareList, setUrgentCareList] = useState([]);
    
    useEffect(() => {
      // Fetch the data whenever refreshKey changes
      const fetchClientList = async () => {
          const urgentCareList = await getDoctorUrgentCareList();
          setUrgentCareList(Array.isArray(urgentCareList) ? urgentCareList : []);
      };
      fetchClientList();
  }, [refreshKey]); // Dependency on refreshKey

    return (
        // TABLE
        <TableContainer component={Paper}>
          <Table aria-label="Urgent Care" stickyHeader>
              <TableHead>
              <TableRow>
                  <StyledTableCell>Urgent Care</StyledTableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {urgentCareList.map((row) => (
                  <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                      {row.firstName} {row.lastName}
                      </StyledTableCell>
                  </StyledTableRow>
              ))}
              </TableBody>
          </Table>
        </TableContainer>
    );
};
export default UrgentCareTable;