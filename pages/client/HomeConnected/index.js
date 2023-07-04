import {TogglersProvider} from "@/components/context/togglers";
import HeaderConnected from "@/components/client/Connected";
import MobileNavConnected from "@/components/client/MobileNavConnected";
import QuickEasy from "@/components/client/QuickEasy";
import Footer from "@/components/client/Footer";
import VehicleSearchForm from "@/components/client/VehicleSearchForm";
import React from "react";
import QuickEasy2 from "@/components/client/QuickEasy2";
import Slider from "@/components/client/Slider";
import CitiesSlider from "@/components/client/CitiesSlider";
import HeroConn from "@/components/client/HeroConn";
import ModelFront from "@/components/client/ModelFront";
import ReservationsGuide from "@/components/client/ReservationsGuide";
import SaveBig from "@/components/client/BigSave";
import Footer2 from "@/components/client/Footeur2";
import ModelFrontConn from "@/components/client/ModelFrontConn";




function page() {
    return (
        <TogglersProvider>
        <main className='overflow-hidden'>

                        <HeaderConnected/>
                        <MobileNavConnected/>
                        <HeroConn/>
            <div className="-mt-20 flex justify-center ">
                <VehicleSearchForm />
            </div>
            <QuickEasy />
            <div className="mt-8 flex justify-center ">
                <ModelFrontConn />
            </div>
            <QuickEasy2 />
            <ReservationsGuide />
            <SaveBig />
            <CitiesSlider />
            <Footer2 />

        </main>
         </TogglersProvider>


    );
}

export default page;