import { protectRoute } from "@/utils/auth";
import React from "react";
import SuperAdminCartable from "@/components/super-admin/super-admin-cartable";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";

export default function SuperAdminCar({ session }) {
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                    <SuperAdminCartable />
            </section>
        </main>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
