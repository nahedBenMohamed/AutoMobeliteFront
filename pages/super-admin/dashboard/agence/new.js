import { protectRoute } from "@/utils/auth";
import React from "react";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminAgenceForm from "@/components/super-admin/super-admin-agenceform";

export default function SuperAdminNewAgence({ session }) {
    return (
        <main>
            <SuperAdminSidebar />
            <section id="content">
                <SuperAdminNavbar session={session} />
                <div style={{ margin: '60px 90px' }}>
                    <SuperAdminAgenceForm />
                </div>
            </section>
        </main>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
