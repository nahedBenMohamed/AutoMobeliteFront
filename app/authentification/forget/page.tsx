"use client";

import React from "react";
import MobileNavbar from "@/app/components/MobileNavbar";
import Header from "@/app/components/Header";
import Forgetpassword from "@/app/components/forget";




function page() {
    return (
        <main>
            <Header />
            <MobileNavbar />
            <Forgetpassword />
        </main>


    );
}

export default page;