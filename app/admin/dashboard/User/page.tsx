"use client"

import React from "react";
import TableUsers from '@/app/admin/component/User/UserList';
import Grid from '@mui/material/Grid';
import Navbar from "@/app/admin/component/dashboard/NavBar"
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box';
import PageContainer from '@/app/admin/component/container/PageContainer';

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
        <Grid>
          <Grid item xs={12}>
              <TableUsers/>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Page;
