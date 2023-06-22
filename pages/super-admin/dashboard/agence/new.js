import SuperAdminAgence from "@/components/super-admin/super-admin-agence";
import {protectRoute} from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";

export default function NewAgence(){
    return (
        <div>
            <SuperAdminSidebar/>
            <SuperAdminAgence/>
        </div>

    );
};

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};