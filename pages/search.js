import React from "react";
import Header from "@/components/client/Header";
import BannerHero from "@/components/client/BannerHero";
import Footer from "@/components/client/Footer";
import SearchResults from "@/components/client/search-results";


function page() {
    return (
            <main>
                <Header />
                <BannerHero htmlId="models-hero" page="Vehicle Models" />
                <SearchResults/>
                <Footer />
            </main>
    );
}

export default page;
