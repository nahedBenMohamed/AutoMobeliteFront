// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

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
  createData('1', 'victory', 'aime', 'victoryaime@gmail.com', 51719140),
  createData('2', 'anta', 'mory', 'antamory@gmail.com', 51719140),
  createData('3', 'rassoul', 'diallo', 'rassouldiallo@gmail.com', 51719140),
]

const TableUsers = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>ID</TableCell>
            <TableCell align='center'>Name</TableCell>
            <TableCell align='center'>First Name</TableCell>
            <TableCell align='center'>email</TableCell>
            <TableCell align='center'>Tel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" align="center">{row.id}</TableCell>
              <TableCell align='center'>{row.name}</TableCell>
              <TableCell align='center'>{row.prenom}</TableCell>
              <TableCell align='center'>{row.email}</TableCell>
              <TableCell align='center'>{row.tel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableUsers
