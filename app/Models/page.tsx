"use client";

import React from "react";
import {TogglersProvider} from "@/app/front-end/context/togglers";
import Header from "@/app/front-end/component/Header";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import Models from "@/app/front-end/component/Models";
import Footer from "@/app/front-end/component/Footer";
import BannerHero from "@/app/front-end/component/BannerHero";


function page() {
    return (
        <TogglersProvider>
            <main>
                <Header />
                <MobileNavbar />
                <BannerHero htmlId="models-hero" page="Vehicle Models" />
                <Models />
                <Footer />
            </main>
        </TogglersProvider>
    );
}

export default page;
