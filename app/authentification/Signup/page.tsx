"use client";

import React from "react";
import Header from "@/app/front-end/component/Header";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import Signup from "@/app/front-end/component/Signup";



function page() {
    return (
        <main>
            <Header />
            <MobileNavbar />
            <Signup />
        </main>


    );
}

export default page;