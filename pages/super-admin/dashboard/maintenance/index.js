import { protectRoute } from "@/utils/auth";
import React from "react";
import SuperAdminMaintenancetable from "@/components/super-admin/super-admin-maintenace";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";

export default function Car({ session }) {
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Manage Maintenance Car's {'\u{1F697}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '-20px 0px' }}>
                    <SuperAdminMaintenancetable />
                </div>
            </section>
        </main>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
