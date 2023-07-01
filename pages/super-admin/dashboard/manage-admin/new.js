import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import RegisterAdmin from "@/components/super-admin/admin-register";
import React from "react";



export default function SuperAdminNewCars({session}){
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session}/>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "30px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Create Admin {'\u{1F464}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '30px 20px' }}>
                    <RegisterAdmin/>
                </div>
            </section>
        </main>

    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
