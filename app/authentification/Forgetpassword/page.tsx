"use client";

import React from "react";
import Header from "@/app/front-end/component/Header";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import Forgetpassword from "@/app/front-end/component/Forgetpassword";



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