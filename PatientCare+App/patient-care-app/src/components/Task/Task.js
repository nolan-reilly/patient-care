import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import "./Task.css";
import { GridRowModes, DataGrid, GridToolbarContainer, GridRowEditStopReasons } from '@mui/x-data-grid';
import { randomCreatedDate, randomId } from '@mui/x-data-grid-generator';

const initialRows = [
  {
    id: randomId(),
    todo: "Meeting radiography department",
    date: randomCreatedDate(),
    status: "In Progress",
    },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', age: '', role: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const Task = () => {

  const navigate = useNavigate();

  useEffect(() => {
      if (sessionStorage.getItem('token') === null || sessionStorage.getItem('role') !== 'Doctor') {
          // Redirect to login page
          navigate('/');
      }
  }, [navigate]);

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
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
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { 
      field: 'todo', 
      headerName: 'Todo',
      type: 'string',
      align: 'left',
      headerAlign: 'left', 
      flex: 1,
      minWidth: 150,
      editable: true,
      headerClassName: "header-cell",
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      flex: 0.5,
      width: 150,
      editable: true,
      headerClassName: "header-cell",
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'string',
      align: 'left',
      headerAlign: 'left',
      flex: 0.5,
      width: 150,
      editable: true,
      headerClassName: "header-cell",
    },
  ];

return (
    <Box sx={{ width: "100%" }}>
        <DataGrid
        className="task-card"
        sx={{
            '& .header-cell': {
            backgroundColor: '#f0f0f0',
            },
            '& .MuiDataGrid-columnSeparator': {
            display: 'none',
            },
            '& .MuiDataGrid-columnHeader': {
            pointerEvents: 'none',
            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
            pointerEvents: 'auto',
            },
        }}
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
  );
}

export default Task;