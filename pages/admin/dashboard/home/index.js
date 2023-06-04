import React from 'react';
import DashboardHeader from "@/components/admin/Header";
import DashboardCards from "@/components/admin/DashboardCards";
import RevenueCards from "@/components/admin/RevenueCards";

const Home = () => {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <DashboardCards />
            </div>
            <div style={{ margin: '20px 90px' }}>
                <RevenueCards />
            </div>
        </div>
    );
};

export default Home;
