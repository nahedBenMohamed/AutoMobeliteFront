import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";
import React from "react";
import ManageRentals from "@/components/admin/ManageRentals";
import Footer from "@/components/admin/Footer";


export default function Reservations ({session})  {
    return (
        <main>
            <Sidebar session={session} />
            <section id="content">
                <Navbar session={session}/>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Manage Rental's {'\u{1F4B5}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '-40px 0px' }}>
                    <ManageRentals />
                </div>
            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
