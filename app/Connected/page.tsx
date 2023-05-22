"use client";

import React from "react";
import {TogglersProvider} from "@/app/front-end/context/togglers";
import {InputValueProvider} from "@/app/front-end/context/inputValue";
import {CurrentValueProvider} from "@/app/front-end/context/currentValue";
import HeaderConnected from "@/app/front-end/component/Connected";
import MobileNavConnected from "@/app/front-end/component/MobileNavConnected";
import HeroHome from "@/app/front-end/component/HeroHome";
import HomeDetails from "@/app/front-end/component/HomeDetails";
import Booking from "@/app/front-end/component/Booking";
import BookingModal from "@/app/front-end/component/BookingModal";
import RentalFleet from "@/app/front-end/component/RentalFleet";
import Footer from "@/app/front-end/component/Footer";
import HeaderConn from "@/app/front-end/component/Connected";



function page() {
    return (
        <main>
            <TogglersProvider>
                <InputValueProvider>
                    <CurrentValueProvider>
                        <HeaderConn />
                        <MobileNavConnected />
                        <HeroHome />
                        <HomeDetails />
                        <Booking />
                        <BookingModal />
                        <RentalFleet />
                        <Footer />
                    </CurrentValueProvider>
                </InputValueProvider>
            </TogglersProvider>
        </main>


    );
}

export default page;