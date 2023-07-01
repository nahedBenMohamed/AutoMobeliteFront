import SuperAdminAgencetable from "@/components/super-admin/super-admin-agencetable";
import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import React from "react";


export default function SuperAdminAgence ({session})  {
    return (
    <main>
        <SuperAdminSidebar />
        <section id="content">
            <SuperAdminNavbar session={session}/>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                    Manage Agencies {'\u{1F3E2}'}
                </h1>
                <div style={{ width: "100%" }}></div>
            </div>
            <div style={{ margin: '-40px 0px' }}>
                <SuperAdminAgencetable />
            </div>
        </section>
    </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};