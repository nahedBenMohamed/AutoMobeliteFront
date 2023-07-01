import Sidebar from "@/components/admin/Sidebar";
import Profile from "@/components/admin/Profile";
import Navbar from "@/components/admin/Navbar";
import {protectRoute} from "@/utils/auth";
import React from "react";



export default function ProfileUsers ({session})  {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session}/>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Manage Profile {'\u{1F464}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '0px 0px' }}>
                    <Profile />
                </div>

            </section>
        </main>
    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
