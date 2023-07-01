import React from 'react';
import {protectRoute} from "@/utils/auth";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import Home from "@/components/super-admin/SuperDashboardHome";




function SuperAdminDashboard({ session }) {
    return (

        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session}/>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Welcome {'\u{1F44B}'} {' '} {session.name}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '-40px 10px' }}>
                    <Home />
                </div>
            </section>
        </main>
    );
}

export default SuperAdminDashboard;

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
