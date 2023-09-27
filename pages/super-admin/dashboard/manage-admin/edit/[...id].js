import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { protectRoute } from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import EditAdmin from "@/components/super-admin/super-admin-editadmin-form";

export default function SuperAdminEditAdmin({ session }) {
  const [adminInfo, setAdminInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/super-admin/manage-admin/admin?id=" + id, {
        withCredentials: true,
      })
      .then((response) => {
        setAdminInfo(response.data);
      });
  }, [id]);

  return (
    <main>
      <SuperAdminSidebar />
      <section id="content">
        <SuperAdminNavbar session={session} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            margin: "30px 30px",
          }}
        >
          <h1
            style={{
              marginRight: "10px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Manage Admin {"\u{1F464}"}
          </h1>
          <div style={{ width: "100%" }}></div>
        </div>
        <div style={{ margin: "20px 0px" }}>
          {adminInfo && <EditAdmin {...adminInfo} />}
        </div>
      </section>
    </main>
  );
}
export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
