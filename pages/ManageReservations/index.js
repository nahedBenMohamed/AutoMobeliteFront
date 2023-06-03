import React from "react";
import HeaderConnected from "@/pages/components/Connected";
import ManageReservations from "@/pages/components/ManageReservations";
import MobileNavConnected from "@/pages/components/MobileNavConnected";


function page() {
    return (
        <main>
            <HeaderConnected />
            <ManageReservations />
            <MobileNavConnected />

        </main>


    );
}

export default page;