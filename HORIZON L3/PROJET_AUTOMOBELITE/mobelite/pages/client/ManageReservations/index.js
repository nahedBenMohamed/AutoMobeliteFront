import React from "react";
import HeaderConnected from "@/components/client/Connected";
import ManageReservations from "@/components/client/ManageReservations";
import MobileNavConnected from "@/components/client/MobileNavConnected";

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