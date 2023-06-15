import React from "react";
import {TogglersProvider} from "@/components/client/context/togglers";
import NavBar from "@/components/client/NavBar";
import MobileNavbar from "@/components/client/MobileNavbar";
import Hero from "@/components/client/Hero";
import VehicleSearchForm from "@/components/client/VehicleSearchForm";
import QuickEasy from "@/components/client/QuickEasy";
import Footer from "@/components/client/Footer";
import Slider from "@/components/client/Slider";


export default function Home() {
  return (
      <TogglersProvider>
    <main className='overflow-hidden'>
        <NavBar/>
        <MobileNavbar/>
        <Hero />
        <div className="-mt-20 flex justify-center ">
            <VehicleSearchForm />
        </div>
        <QuickEasy />
        <Slider />
        <QuickEasy />
        <Footer />
    </main>
      </TogglersProvider>
  )
}
