import React from "react";
import HeaderConnected from "@/components/client/HeaderConnected";
import ManageReservations from "@/components/client/ManageReservations";

function page() {
    return (
        <main>
            <HeaderConnected />
            <ManageReservations />

        </main>


    );
}

export default page;