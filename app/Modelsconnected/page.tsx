"use client";

import React from "react";
import {TogglersProvider} from "@/app/front-end/context/togglers";
import Header from "@/app/front-end/component/Header";
import MobileNavbar from "@/app/front-end/component/MobileNavbar";
import Models from "@/app/front-end/component/Models";
import Footer from "@/app/front-end/component/Footer";
import BannerHero from "@/app/front-end/component/BannerHero";
import HeaderConn from '@/app/front-end/component/Connected';
import Modelsconnected from '@/app/front-end/component/Modelsconnected';


function page() {
  return (
    <TogglersProvider>
      <main>
        <HeaderConn />
        <MobileNavbar />
        <BannerHero htmlId="models-hero" page="Vehicle Models" />
        <Modelsconnected />
        <Footer />
      </main>
    </TogglersProvider>
  );
}

export default page;
