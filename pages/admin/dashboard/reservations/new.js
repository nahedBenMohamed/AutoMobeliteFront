import Sidebar from "@/components/admin/Sidebar";
import { protectRoute } from "@/utils/auth";
import React from "react";
import Navbar from "@/components/admin/Navbar";
import AddRental from "@/components/admin/add-rental";

export default function Car({ session }) {
    return (
        <main>
            <Sidebar />
            <section id="content">
                <Navbar session={session} />
                    <AddRental />
            </section>
        </main>
    );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};
