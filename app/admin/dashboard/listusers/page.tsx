"use client"

import React from "react";
import TableUsers from '@/app/admin/componennt/listUsers/UserList';
import Grid from '@mui/material/Grid';
import Navbar from '@/app/admin/componennt/dashboard/navbar';

function Page() {
  const mainStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
  };

  return (
    <main>
      <Navbar/>
      <div style={mainStyles}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableUsers />
        </Grid>
      </Grid>
      </div>
    </main>
  );
}

export default Page;