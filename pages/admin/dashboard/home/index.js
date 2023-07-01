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
                <Navbar session={session} />
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Welcome {'\u{1F44B}'} {' '} {session.agency}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '0px 0px' }}>
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
