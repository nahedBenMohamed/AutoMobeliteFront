"use client";

import React from "react";
import MobileNavbar from "@/app/components/MobileNavbar";
import Header from "@/app/components/Header";
import ForgotPassword from '@/app/components/ForgotPassword';

function page() {
    return (
        <main>
            <Header />
            <MobileNavbar />
            <ForgotPassword />
        </main>


    );
}

export default page;