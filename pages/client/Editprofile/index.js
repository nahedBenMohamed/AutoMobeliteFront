import React from "react";
import HeaderConnected from "@/components/client/Connected";
import Editprofile from "@/components/client/Editprofile";
import MobileNavbar from "@/components/client/MobilNavbar";

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
