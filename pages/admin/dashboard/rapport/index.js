import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import { protectRoute } from "@/utils/auth";
import React from "react";
import RevenusDepenses from "@/components/admin/RevenusDepenses";
import Footer from "@/components/admin/Footer";

export default function Reservations({ session }) {
  return (
    <main>
      <Sidebar session={session} />
      <section id="content">
        <Navbar session={session} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            margin: "40px 30px",
          }}
        >
          <h1
            style={{
              marginRight: "10px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Bilan {session.agency}
            {"\u{1F4B5}"}
          </h1>
          <div style={{ width: "100%" }}></div>
        </div>
        <div>
          <RevenusDepenses />
        </div>
      </section>
      <Footer />
    </main>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["admin"]);
};
