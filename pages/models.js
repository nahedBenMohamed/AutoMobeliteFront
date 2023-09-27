import React from "react";
import Header from "@/components/client/Header";
import BannerHero from "@/components/client/BannerHero";
import Models from "@/components/client/Models";
import Footer2 from "@/components/client/Footeur2";

function page() {
  return (
    <main>
      <Header />
      <BannerHero htmlId="models-hero" page="Vehicle Models" />
      <Models />
      <Footer2 />
    </main>
  );
}

export default page;
