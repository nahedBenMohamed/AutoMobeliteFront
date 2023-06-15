import DashboardHeader from "@/components/admin/Header";
import Profile from "@/components/admin/Profile";


export default function ProfileUsers ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <Profile/>
            </div>
        </div>
    );
};