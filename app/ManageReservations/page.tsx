"use client";

import React from "react";
import ManageReservations from "@/app/components/ManageReservations";
import HeaderConnected from "@/app/components/Connected";
import MobileNavConnected from '@/app/components/MobileNavConnected';

function page() {
    return (
        <main>
            <HeaderConnected />
            <ManageReservations />
            <MobileNavConnected />

        </main>


    );
}

export default page;