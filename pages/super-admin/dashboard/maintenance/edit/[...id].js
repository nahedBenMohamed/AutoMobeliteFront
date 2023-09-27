import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { protectRoute } from "@/utils/auth";
import SuperAdminMaintenanceEdit from "@/components/super-admin/super-admin-maintenance-edit";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";

export default function EditCar({ session }) {
  const [rentalInfo, setRentalInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/super-admin/manage-maintenance/maintenance?id=" + id, {
        withCredentials: true,
      })
      .then((response) => {
        setRentalInfo(response.data);
      });
  }, [id]);

  return (
    <main>
      <SuperAdminSidebar />
      <section id="content">
        <SuperAdminNavbar session={session} />
        <div
          style={{
            margin: "60px 10px",
          }}
        >
          {rentalInfo && <SuperAdminMaintenanceEdit {...rentalInfo} />}
        </div>
      </section>
    </main>
  );
}
export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
