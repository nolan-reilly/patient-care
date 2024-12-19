import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Typography, Alert, Snackbar, } from '@mui/material';
import { addPrescription } from '../../api/doctorActions';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomId,
} from '@mui/x-data-grid-generator';

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
    
  };

  const handleUploadClick = () => {
    console.log("Upload record");
    alert("Upload successful");
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      <Button color="primary" startIcon={<CloudUploadIcon />} onClick={handleUploadClick}>
        Upload record
      </Button>
    </GridToolbarContainer>
  );
}


const Prescription = ({ patientInfo }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('role') !== 'Doctor') {
            navigate('/');
        }

        if (patientInfo) {
          setRows(patientInfo.patientPrescriptionData);
        }
        
    }, [navigate, patientInfo]);
  
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const handleRowEditStop = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };

    const [alert, setAlert] = useState({
      open: false,
      type: 'warning',
      message: ''
  });

    const showAlert = (type, message) => {
      setAlert({ open: true, type: type, message: message});
      setTimeout(() => setAlert((prev) => ({ ...prev, open: false})), 3000);
    };

    // Commented out unused code
    // const handleEditClick = (id) => () => {
    //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    // };
  
    // const handleSaveClick = (id) => () => {
    //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // };
  
    // const handleDeleteClick = (id) => () => {
    //   setRows(rows.filter((row) => row.id !== id));
    // };
  
    // const handleCancelClick = (id) => () => {
    //   setRowModesModel({
    //     ...rowModesModel,
    //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
    //   });
  
    //   const editedRow = rows.find((row) => row.id === id);
    //   if (editedRow.isNew) {
    //     setRows(rows.filter((row) => row.id !== id));
    //   }
    // };
  
    const processRowUpdate = (newRow) => {
      if(newRow.isNew) {
        var prescription_info = {
          "patientPrescriptionData": {
            "medication": newRow.medication,
            "dosage": newRow.dosage,
            "startDate": newRow.startDate,
            "endDate": newRow.endDate,
            "remarks": newRow.remarks
          },
          "patientEmail": patientInfo.email
        };

    
        addPrescription(prescription_info);
        console.log(prescription_info);
        showAlert('success', "Prescription added successfully...");
      }     

      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      console.log(updatedRow);
      return updatedRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };
  
    const columns = [
      { 
        field: 'medication', 
        headerName: 'Medication',
        type: 'string',
        align: 'left',
        headerAlign: 'left', 
        width: 200, 
        editable: true 
      },
      {
        field: 'dosage',
        headerName: 'Dosage',
        type: 'string',
        align: 'left',
        headerAlign: 'left',
        width: 180,
        editable: true,
    },
    {
        field: 'startDate',
        headerName: 'Start Date',
        type: 'Date',
        width: 180,
       // valueGetter: (params) => new Date(params.row.date),
        editable: true,
    },
    {
        field: 'endDate',
        headerName: 'End Date',
        type: 'Date',
        width: 180,
        //valueGetter: (params) => new Date(params.row.date),
        editable: true,
    },
    {
        field: 'remarks',
        headerName: 'Remarks',
        type: 'string',
        align: 'left',
        headerAlign: 'left',
        width: 180,
        editable: true,
    }
    ];
  
    return (
    <Box>
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
        <Typography variant="h5" className="underline" gutterBottom>
            Prescriptions
        </Typography>
        <Box sx={{
            height: 400,
            '& .actions': {
                color: 'text.secondary',
            },
            '& .textPrimary': {
                color: 'text.primary',
            },
        }}>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    </Box>
    );
};

export default Prescription;