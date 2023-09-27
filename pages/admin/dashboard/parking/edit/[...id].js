import Sidebar from "@/components/admin/Sidebar";
import Parkingform from "@/components/admin/Parkingform";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/admin/Navbar";
import axios from "axios";
import { protectRoute } from "@/utils/auth";

export default function EditParking({ session }) {
  const [parkingInfo, setParkingInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/admin/manage-parking/parking?id=" + id, {
        withCredentials: true,
      })
      .then((response) => {
        setParkingInfo(response.data);
      });
  }, [id]);

  return (
    <main>
      <Sidebar session={session} />
      <section id="content">
        <Navbar session={session} />
        <div style={{ margin: "60px 90px" }}>
          {parkingInfo && <Parkingform {...parkingInfo} />}
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["admin"]);
};
