"use client";

import React from "react";
import HeaderConnected from "@/app/components/Connected";
import Editprofile from "@/app/components/Editprofile";
import MobileNavbar from "@/app/components/MobileNavbar";

function page() {
    return (
        <main>
            <HeaderConnected />
            <Editprofile />
            <MobileNavbar />

        </main>


    );
}

export default page;