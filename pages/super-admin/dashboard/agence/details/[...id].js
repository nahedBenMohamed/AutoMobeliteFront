import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { protectRoute } from "@/utils/auth";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminDetailsAgence from "@/components/super-admin/super-admin-agencedetails";

export default function SuperDetailsCar({ session }) {
  const [agencyInfo, setAgencyInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/super-admin/manage-agence/agence?id=" + id, {
        withCredentials: true,
      })
      .then((response) => {
        setAgencyInfo(response.data);
      });
  }, [id]);

  return (
    <main>
      <SuperAdminSidebar />
      <section id="content">
        <SuperAdminNavbar session={session} />
        <div style={{ margin: "60px 10px" }}>
          {agencyInfo && <SuperAdminDetailsAgence {...agencyInfo} />}
        </div>
      </section>
    </main>
  );
}
export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
