"use client"
import React from "react";
import Navbar from "@/app/admin/component/dashboard/NavBar"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PageContainer from '@/app/admin/component/container/PageContainer';
import { Cars } from '@/app/admin/component/Cars';
import CardHeader from '@mui/material/CardHeader';
import { Card } from '@mui/material';
import CarTable from '@/app/admin/component/Cars/TableList';
import { AddCar } from '@/app/admin/component/Cars/add-cars';

function Page() {
  const mainStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const gridContainerStyles = {
    justifyContent: 'center',
  };

  return (
    <>
      <Navbar />
      <Box style={mainStyles}>
        <Grid container spacing={6} style={gridContainerStyles}>
          <Grid item xs={10}>
            <AddCar />
          </Grid>
          <Grid item xs={10}>
            <CarTable />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Page;
