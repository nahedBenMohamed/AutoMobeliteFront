import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import Pagination from "@mui/material/Pagination";

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
}));;

const createData = (
  id: string,
  name: string,
  prenom: string,
  email: string,
  tel: number
) => {
  return { id, name, prenom, email,tel };
};

const rows = [
  createData("2", "anta", "mory", "antamory@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("2", "anta", "mory", "antamory@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("2", "anta", "mory", "antamory@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("2", "anta", "mory", "antamory@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "diallo", "rassouldiallo@gmail.com", 51719140),
  createData("3", "rassoul", "chaychay", "rassouldiallo@gmail.com", 51719140),

  // ... more data
  // Add more rows as per your requirement
];

const pageSize = 5; // Nombre d'éléments à afficher par page

export default function TabUsers() {

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
      <Table sx={{ minWidth: 110*10 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">First Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Tel</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedRows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row" align="center">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="center">{row.name}</StyledTableCell>
              <StyledTableCell align="center">{row.prenom}</StyledTableCell>
              <StyledTableCell align="center">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.tel}</StyledTableCell>
            </StyledTableRow>
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
}