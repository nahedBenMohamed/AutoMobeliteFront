"use client"

import React from "react";
import Grid from '@mui/material/Grid';
import Navbar from '@/app/admin/componennt/dashboard/navbar';
import Reservelist from '@/app/admin/componennt/reservation/reservelist';

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
            <Reservelist />
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

export default Page;
