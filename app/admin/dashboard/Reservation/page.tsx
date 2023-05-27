"use client"

import React from "react";
import Grid from '@mui/material/Grid';
import Navbar from '@/app/admin/component/dashboard/NavBar';
import Reservelist from '@/app/admin/component/Reservation/reservelist';

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
        <main>
            <Navbar/>
            <div style={mainStyles}>
                <Grid container spacing={3} style={gridContainerStyles}>
                    <Grid item xs={12}>
                        <Reservelist />
                    </Grid>
                </Grid>
            </div>
        </main>
    );
}

export default Page;
