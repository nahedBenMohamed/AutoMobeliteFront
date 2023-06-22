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
                    <Slider />
                </div>
                <QuickEasy2 />
                <CitiesSlider />
                <Footer />

        </main>
         </TogglersProvider>


    );
}

export default page;