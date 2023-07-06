import HeaderConnected from "@/components/client/HeaderConnected";
import QuickEasy from "@/components/client/QuickEasy";
import VehicleSearchForm from "@/components/client/VehicleSearchForm";
import React from "react";
import QuickEasy2 from "@/components/client/QuickEasy2";
import CitiesSlider from "@/components/client/CitiesSlider";
import ReservationsGuide from "@/components/client/ReservationsGuide";
import SaveBig from "@/components/client/BigSave";
import Footer2 from "@/components/client/Footeur2";
import HeroConnected from "@/components/client/HeroConnected";
import ModelFrontConnected from "@/components/client/ModelFrontConnected";




function page() {
    return (
        <main className='overflow-hidden'>

                        <HeaderConnected/>
                        <HeroConnected/>
            <div className="-mt-20 flex justify-center ">
                <VehicleSearchForm />
            </div>
            <QuickEasy />
            <div className="mt-8 flex justify-center ">
                <ModelFrontConnected />
            </div>
            <QuickEasy2 />
            <ReservationsGuide />
            <SaveBig />
            <CitiesSlider />
            <Footer2 />

        </main>


    );
}

export default page;