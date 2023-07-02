import React from "react";
import Header from "@/components/client/Header";
import MobileNavbar from "@/components/client/MobilNavbar";
import Hero from "@/components/client/Hero";
import {TogglersProvider} from "@/components/context/togglers";
import VehicleSearchForm from "@/components/client/VehicleSearchForm";
import QuickEasy from "@/components/client/QuickEasy";
import QuickEasy2 from "@/components/client/QuickEasy2";
import CitiesSlider from "@/components/client/CitiesSlider";
import Footer2 from "@/components/client/Footeur2";
import ReservationsGuide from "@/components/client/ReservationsGuide";
import SaveBig from "@/components/client/BigSave";
import ModelFront from "@/components/client/ModelFront";





export default function Home() {
    return (
        <TogglersProvider>
            <main className='overflow-hidden'>
                <Header/>
                <MobileNavbar/>
                <Hero />
                <div className="-mt-20 flex justify-center ">
                    <VehicleSearchForm />
                </div>
                <QuickEasy />
                <div className="mt-8 flex justify-center ">
                    <ModelFront />
                </div>
                <QuickEasy2 />
                <ReservationsGuide />
                <SaveBig />
                <CitiesSlider />
                <Footer2 />
            </main>
        </TogglersProvider>
    )
}
