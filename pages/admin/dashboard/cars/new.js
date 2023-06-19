import CarForm from "@/components/admin/CarForm";
import DashboardHeader from "@/components/admin/Header";
import {protectRoute} from "@/utils/auth";

export default function NewCars(){
    return (
          <div>
              <DashboardHeader/>
              <CarForm/>
          </div>

        );
}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin']);
};