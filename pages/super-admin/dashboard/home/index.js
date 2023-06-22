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
                <div style={{ margin: '60px 90px' }}>
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
