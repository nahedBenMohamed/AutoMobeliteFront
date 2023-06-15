import DashboardHeader from "@/components/admin/Header";
import UserTable from "@/components/admin/UserTable";


export default function Car ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <UserTable />
            </div>
        </div>
    );
};