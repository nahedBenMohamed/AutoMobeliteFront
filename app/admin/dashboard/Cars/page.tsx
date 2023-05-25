"use client"

import React from "react";
import Navbar from "@/app/admin/component/dashboard/NavBar"
import {AddCar} from "@/app/admin/component/Cars/add-cars";
import Grid from '@mui/material/Grid';
import CarTable from "@/app/admin/component/Cars/liste";

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
        <main>
            <Navbar/>
            <div style={mainStyles}>
                <Grid container spacing={6} style={gridContainerStyles}>
                    <Grid item xs={6}>
                        <AddCar />
                    </Grid>
                    <Grid item xs={12}>
                        <CarTable />
                    </Grid>
                </Grid>
            </div>
        </main>
    );
}

export default Page;
