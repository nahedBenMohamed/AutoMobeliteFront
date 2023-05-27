"use client";

import React from "react";
import MobileNavbar from "@/app/components/MobileNavbar";
import Header from "@/app/components/Header";
import Login from "@/app/components/Login"


function page() {
    return (
        <main>
            <Header />
            <MobileNavbar />
            <Login/>
        </main>


    );
}

export default page;