import React from "react";
import Header from "@/components/client/Header";
import Hero from "@/components/client/Hero";
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
            <main className='overflow-hidden'>
                <Header/>
                <Hero />
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

    )
}
