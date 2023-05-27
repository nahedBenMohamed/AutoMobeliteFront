import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#086CDD', // Arrière-plan bleu
    color: 'white', // Écriture blanche
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



const createData = (
  id: string,
  name: string,
  prenom: string,
  email: string,
  marque: string,
  model: string,
  matricule: string,
  years: number,
  kilometers: number,
  color: string,
  cost: number
) => {
  return { id, name, prenom, email,marque, model, matricule, years, kilometers, color, cost };
};

const rows = [
  createData('1', 'victory', 'aime', 'victoryaime@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('2', 'anta', 'mory', 'antamory@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('3', 'rassoul', 'diallo', 'rassouldiallo@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('1', 'victory', 'aime', 'victoryaime@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('2', 'anta', 'mory', 'antamory@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('3', 'rassoul', 'diallo', 'rassouldiallo@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('1', 'victory', 'aime', 'victoryaime@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('2', 'anta', 'mory', 'antamory@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('3', 'rassoul', 'diallo', 'rassouldiallo@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('1', 'victory', 'aime', 'victoryaime@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('2', 'anta', 'mory', 'antamory@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('3', 'rassoul', 'diallo', 'rassouldiallo@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('1', 'victory', 'aime', 'victoryaime@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('2', 'anta', 'mory', 'antamory@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('3', 'rassoul', 'diallo', 'rassouldiallo@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('1', 'victory', 'aime', 'victoryaime@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('2', 'anta', 'mory', 'antamory@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
  createData('3', 'rassoul', 'diallo', 'rassouldiallo@gmail.com', 'peugoet', '208', 'AO5278', 2012, 0, 'red', 63),
];
const pageSize = 5; // Nombre d'éléments à afficher par page

const ReserveList = () => {
  // @ts-ignore
  const handleEdit = (id) => {
    console.log(`Edit car with ID: ${id}`);
    // Ajoutez ici la logique pour gérer l'événement de modification
  };

  // @ts-ignore
  const handleDelete = (id) => {
    console.log(`Delete car with ID: ${id}`);
    // Ajoutez ici la logique pour gérer l'événement de suppression
  };


  const [page, setPage] = useState(1);

  // @ts-ignore
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedRows = rows.slice(startIndex, endIndex);

  return (
    <TableContainer component={Paper} style={{ width: "100%", overflowX: "auto" }}>
      <Table sx={{ minWidth: 100*9 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">First name</StyledTableCell>
            <StyledTableCell align="center">email</StyledTableCell>
            <StyledTableCell align="center">marque</StyledTableCell>
            <StyledTableCell align="center">modele</StyledTableCell>
            <StyledTableCell align="center">matricule</StyledTableCell>
            <StyledTableCell align="center">Years</StyledTableCell>
            <StyledTableCell align="center">Kilometers</StyledTableCell>
            <StyledTableCell align="center">Color</StyledTableCell>
            <StyledTableCell align="center">Cost</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedRows.map((row) => (
            <TableRow key={row.id}>
              <StyledTableCell component="th" scope="row" align="center">{row.id}</StyledTableCell>
              <StyledTableCell align="center">{row.name}</StyledTableCell>
              <StyledTableCell align="center">{row.prenom}</StyledTableCell>
              <StyledTableCell align="center">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.marque}</StyledTableCell>
              <StyledTableCell align="center">{row.model}</StyledTableCell>
              <StyledTableCell align="center">{row.matricule}</StyledTableCell>
              <StyledTableCell align="center">{row.years}</StyledTableCell>
              <StyledTableCell align="center">{row.kilometers}</StyledTableCell>
              <StyledTableCell align="center">{row.color}</StyledTableCell>
              <StyledTableCell align="center">{row.cost}</StyledTableCell>
              <StyledTableCell align="center">
                <Tooltip title="Details">
                  <IconButton aria-label="Edit" onClick={() => handleEdit(row.id)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton aria-label="Delete" onClick={() => handleDelete(row.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
        <Pagination
          count={Math.ceil(rows.length / pageSize)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          style={{ marginTop: 16 }}
        />
      </Table>
    </TableContainer>
  );
};

export default ReserveList;
