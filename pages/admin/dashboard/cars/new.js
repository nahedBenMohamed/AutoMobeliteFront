import Sidebar from "@/components/admin/Sidebar";
import CarForm from "@/components/admin/CarForm";
import Navbar from "@/components/admin/Navbar";
import { protectRoute } from "@/utils/auth";
import React from "react";

export default function NewCars({ session }) {
  return (
    <main>
      <Sidebar session={session} />
      <section id="content">
        <Navbar session={session} />
        <div style={{ margin: "60px 90px" }}>
          <CarForm />
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["admin"]);
};
