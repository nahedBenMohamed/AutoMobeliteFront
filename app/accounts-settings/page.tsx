"use client";

import React from "react";
import HeaderConnected from "@/app/components/connected";
import Footer from "@/app/components/Footer";
import Editprofile from "@/app/components/EditProfile";
import MobileNavbar from "@/app/components/MobileNavbar";




function page() {
    return (
        <main>
            <HeaderConnected />
            <Editprofile />
            <MobileNavbar />
            <Footer/>
        </main>


    );
}

export default page;