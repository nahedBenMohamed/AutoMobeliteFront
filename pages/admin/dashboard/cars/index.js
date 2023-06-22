import VehicleTable from "@/components/admin/CarsTable";
import Sidebar from "@/components/admin/Sidebar";
import { protectRoute } from "@/utils/auth";
import React from "react";
import Navbar from "@/components/admin/Navbar";

export default function Car({ session }) {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session} />
                <div style={{ margin: '60px 90px', display: 'flex', justifyContent: 'center' }}>
                    <VehicleTable />
                </div>
            </section>
        </main>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
