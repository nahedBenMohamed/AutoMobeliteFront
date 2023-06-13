import React from 'react';
import DashboardHeader from "@/components/admin/Header";
import {protectRoute} from "@/utils/auth";




function Dashboard({session}) {
    return (
        <div>
        <DashboardHeader/>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Bienvenue, {session.name}. Vous êtes responsable de l'agence {session.agenceName}.
            </h1>
        </div>
        </div>
    )
}

export default Dashboard;

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin', 'superAdmin']);
};
