"use client";

import React from "react";
import HeaderConn from "@/app/front-end/component/Connected";
import Editprofile from "@/app/front-end/component/Editprofile";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";




function page() {
    return (
        <main>
            <HeaderConn />
            <Editprofile />
            <MobileNavbar />
        </main>


    );
}

export default page;