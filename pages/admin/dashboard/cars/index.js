import VehicleTable from "@/components/admin/CarsTable";
import Sidebar from "@/components/admin/Sidebar";
import { protectRoute } from "@/utils/auth";
import React from "react";
import Navbar from "@/components/admin/Navbar";
import Footer from "@/components/admin/Footer";

export default function Car({ session }) {
    return (
        <main>
            <Sidebar session={session} />
            <section id="content">
                <Navbar session={session} />
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                       Manage Car's {'\u{1F697}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '-20px 0px' }}>
                    <VehicleTable />
                </div>
            </section>
        </main>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
