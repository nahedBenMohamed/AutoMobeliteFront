"use client";

import React from "react";
import Header from "@/app/front-end/component/Header";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import Login from "@/app/front-end/component/Login";


function page() {
    return (
        <main>

            <MobileNavbar />
            <Login />
        </main>


    );
}

export default page;