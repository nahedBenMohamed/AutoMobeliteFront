"use client";

import React from "react";
import ManageReservations from "@/app/components/ManageReservations";
import HeaderConnected from "@/app/components/connected";
import MobileNavbar from "@/app/components/MobileNavbar";
import Footer from "@/app/components/Footer";

function page() {
    return (
        <main>
            <HeaderConnected />
            <ManageReservations />
            <MobileNavbar />
            <Footer/>
        </main>


    );
}

export default page;