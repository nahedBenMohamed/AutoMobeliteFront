"use client";

import React from "react";
import Register from "@/app/components/register";
import MobileNavbar from "@/app/components/MobileNavbar";
import Header from "@/app/components/Header";




function page() {
    return (
        <main>
            <Header />
            <MobileNavbar />
            <Register />
        </main>


    );
}

export default page;