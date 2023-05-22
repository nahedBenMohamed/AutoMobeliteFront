"use client";

import React from "react";
import HeaderConn from "@/app/front-end/component/Connected";

import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import Reservations from "@/app/front-end/component/Reservations";





function page() {
    return (
        <main>
            <HeaderConn />
            <Reservations />
            <MobileNavbar />


        </main>


    );
}

export default page;