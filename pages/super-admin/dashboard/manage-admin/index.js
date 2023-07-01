import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import React from "react";
import {protectRoute} from "@/utils/auth";
import SuperAdminManageTable from "@/components/super-admin/super-admin-manageadmin-table";


export default function ManageAdmin({session}){
    return(
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", margin: "40px 30px" }}>
                    <h1 style={{ marginRight: "10px", fontSize: "24px", fontWeight: "bold" }}>
                        Manage Admin {'\u{1F464}'}
                    </h1>
                    <div style={{ width: "100%" }}></div>
                </div>
                <div style={{ margin: '-60px 0px' }}>
                    <SuperAdminManageTable/>
                </div>
            </section>
        </main>
    )
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
