import React from "react";
import Header from "@/components/client/Header";
import BannerHero from "@/components/client/BannerHero";
import Models from "@/components/client/Models";
import Footer from "@/components/client/Footer";


function page() {
    return (
        <main>
            <Header />
            <BannerHero htmlId="models-hero" page="Vehicle Models" />
            <Models />
            <Footer />
        </main>
    );
}

export default page;
