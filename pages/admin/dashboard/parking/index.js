import Sidebar from "@/components/admin/Sidebar";
import Parkingtable from "@/components/admin/Parkingtable";
import Navbar from "@/components/admin/Navbar";
import React from "react";
import {protectRoute} from "@/utils/auth";
import Footer from "@/components/admin/Footer";



export default function Parking ({session})  {
    return (
        <main>
            <Sidebar session={session} />
            <section id="content">
                <Navbar session={session} />
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 40px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Manage Parking's {'\u{1F17F}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: "-40px 10px" }}>
                    <Parkingtable />
                </div>
            </section>
        </main>


    );
};
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
