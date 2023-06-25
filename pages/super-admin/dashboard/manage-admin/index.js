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
                <div style={{ margin: '60px 90px' }}>
                    <SuperAdminManageTable/>
                </div>
            </section>
        </main>
    )
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
