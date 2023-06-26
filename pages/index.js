import React from "react";
import Header from "@/components/client/Header";
import MobileNavbar from "@/components/client/MobilNavbar";
import Hero from "@/components/client/Hero";
import {TogglersProvider} from "@/components/context/togglers";
import VehicleSearchForm from "@/components/client/VehicleSearchForm";
import QuickEasy from "@/components/client/QuickEasy";
import Footer from "@/components/client/Footer";
import Slider from "@/components/client/Slider";
import QuickEasy2 from "@/components/client/QuickEasy2";
import CitiesSlider from "@/components/client/CitiesSlider";
import Footer2 from "@/components/client/Footeur2";





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
                    <Slider />
                </div>
                <QuickEasy2 />
                <CitiesSlider />
                <Footer2 />
            </main>
        </TogglersProvider>
    )
}
