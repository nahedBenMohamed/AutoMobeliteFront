"use client"

import React from "react";
import CarTable from '@/app/admin/componennt/Cars/liste';
import Grid from '@mui/material/Grid';
import { AddCar } from '@/app/admin/componennt/Cars/add-cars';

function Page() {
  const mainStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
  };

  const gridContainerStyles = {
    display: 'flex',
    justifyContent: 'flex-start',
  };

  return (
    <main style={mainStyles}>
      <Grid container spacing={6} style={gridContainerStyles}>
        <Grid item xs={6}>
          <AddCar />
        </Grid>
        <Grid item xs={12}>
          <CarTable />
        </Grid>
      </Grid>
    </main>
  );
}

export default Page;
