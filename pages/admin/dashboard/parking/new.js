import Sidebar from "@/components/admin/Sidebar";
import ParkingForm from "@/components/admin/Parkingform";
import Navbar from "@/components/admin/Navbar";
import { protectRoute } from "@/utils/auth";
import React from "react";

export default function ParkingNew({ session }) {
  return (
    <main>
      <Sidebar session={session} />
      <section id="content">
        <Navbar session={session} />
        <div style={{ margin: "90px 0px" }}>
          <ParkingForm />
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["admin"]);
};
