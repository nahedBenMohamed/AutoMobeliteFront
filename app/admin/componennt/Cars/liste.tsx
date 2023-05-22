// ** MUI Imports
import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const createData = (
  id: string,
  marque: string,
  model: string,
  matricule: string,
  years: number,
  kilometers: number,
  color: string,
  cost: number
) => {
  return { id, marque, model, matricule, years, kilometers, color, cost };
};

const rows = [
  createData(
    '1',
    'Frozen yoghurt',
    'Frozen yoghurt',
    'Frozen yoghurt',
    4.0,
    4.0,
    'Frozen yoghurt',
    4.0
  ),
  createData(
    '2',
    'Frozen yoghurt',
    'Frozen yoghurt',
    'Frozen yoghurt',
    4.0,
    4.0,
    'Frozen yoghurt',
    4000
  ),
  createData(
    '3',
    'Frozen yoghurt',
    'Frozen yoghurt',
    'Frozen yoghurt',
    4.0,
    4.0,
    'Frozen yoghurt',
    2000.0
  ),
];

const CarTable = () => {
  const handleEdit = (id) => {
    console.log(`Edit car with ID: ${id}`);
    // Ajoutez ici la logique pour gérer l'événement de modification
  };

  const handleDelete = (id) => {
    console.log(`Delete car with ID: ${id}`);
    // Ajoutez ici la logique pour gérer l'événement de suppression
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Marque</TableCell>
            <TableCell align="center">Modele</TableCell>
            <TableCell align="center">Matricule</TableCell>
            <TableCell align="center">Years</TableCell>
            <TableCell align="center">Kilometers</TableCell>
            <TableCell align="center">Color</TableCell>
            <TableCell align="center">Cost</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" align="left">
                {row.id}
              </TableCell>
              <TableCell align="center">{row.marque}</TableCell>
              <TableCell align="center">{row.model}</TableCell>
              <TableCell align="center">{row.matricule}</TableCell>
              <TableCell align="center">{row.years}</TableCell>
              <TableCell align="center">{row.kilometers}</TableCell>
              <TableCell align="center">{row.color}</TableCell>
              <TableCell align="center">{row.cost}</TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="Edit"
                  onClick={() => handleEdit(row.id)}
                  color="primary" // Couleur personnalisée
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  onClick={() => handleDelete(row.id)}
                  color="secondary" // Couleur personnalisée
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CarTable;
