import React from "react";
import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminParkingtable from "@/components/super-admin/super-admin-parkingtable";



export default function SuperAdminParking ({session})  {
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    <SuperAdminParkingtable />
                </div>

            </section>
        </main>
    );
};
export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
