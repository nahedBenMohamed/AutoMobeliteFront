import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import { protectRoute } from "@/utils/auth";
import RentalForm from "@/components/admin/RentalForm";
import Footer from "@/components/admin/Footer";

export default function EditCar({ session }) {
  const [carInfo, setCarInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/admin/manage-cars/cars?id=" + id, { withCredentials: true })
      .then((response) => {
        setCarInfo(response.data);
      });
  }, [id]);

  return (
    <main>
      <Sidebar session={session} />
      <section id="content">
        <Navbar session={session} />
        <div
          style={{
            margin: "60px 10px",
          }}
        >
          {carInfo && <RentalForm {...carInfo} />}
        </div>
      </section>
    </main>
  );
}
export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["admin"]);
};
