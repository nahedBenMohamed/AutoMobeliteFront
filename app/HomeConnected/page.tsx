"use client";

import React from "react";
import HeaderConnected from "@/app/components/connected";
import Booking from "@/app/components/Booking";
import Hero from "@/app/components/Hero";
import {TogglersProvider} from "@/app/context/togglers";
import {InputValueProvider} from "@/app/context/inputValue";
import {CurrentValueProvider} from "@/app/context/currentValue";
import BookingModal from "@/app/components/BookingModal";
import RentalFleet from "@/app/components/RentalFleet";
import Footer from "@/app/components/Footer";
import MobileNavConnected from "@/app/components/MobileNavConnected";
import ToTop from "@/app/components/ToTop";
import QuickEasy from "@/app/components/QuickEasy";
import SaveBig from "@/app/components/SaveBig";
import ChooseUs from "@/app/components/ChooseUs";
import Faq from "@/app/components/Faq";



function page() {
    return (
        <main>
            <TogglersProvider>
                <InputValueProvider>
                    <CurrentValueProvider>
                        <HeaderConnected />
                        <MobileNavConnected />
                        <Hero />
                        <ToTop />
                        <Booking />
                        <BookingModal />
                        <QuickEasy />
                        <RentalFleet />
                        <SaveBig />
                        <ChooseUs />
                        <Faq />
                        <Footer />
                    </CurrentValueProvider>
                </InputValueProvider>
            </TogglersProvider>
        </main>


    );
}

export default page;