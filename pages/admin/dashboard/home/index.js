import React from 'react';
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";
import AdminHome from "@/components/admin/DashboardHome";



function Dashboard({ session }) {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session}/>
                <div style={{ margin: '60px 90px' }}>
                    <AdminHome />
                </div>
            </section>
        </main>

    );
}

export default Dashboard;

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
