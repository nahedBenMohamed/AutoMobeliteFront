import Sidebar from "@/components/admin/Sidebar";
import Parkingtable from "@/components/admin/Parkingtable";
import Navbar from "@/components/admin/Navbar";
import React from "react";
import {protectRoute} from "@/utils/auth";



export default function Parking ({session})  {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    <Parkingtable />
                </div>

            </section>
        </main>
    );
};
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
