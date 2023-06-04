import DashboardHeader from "@/components/admin/Header";
import AgenceAdd from "@/components/admin/agenceRegister";


export default function ProfileUsers ()  {
    return (
        <div>
            <DashboardHeader />
            <div style={{ margin: '20px 90px' }}>
                <AgenceAdd/>
            </div>
        </div>
    );
};