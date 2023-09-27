import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { protectRoute } from "@/utils/auth";
import SuperAdminSidebar from "@/components/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/super-admin/SuperAdminNavbar";
import EditUser from "@/components/super-admin/super-admin-edit-user";

export default function SuperAdminEditAdmin({ session }) {
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/super-admin/manage-user/user?id=" + id, {
        withCredentials: true,
      })
      .then((response) => {
        setUserInfo(response.data);
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
            Manage User's {"\u{1F464}"}
          </h1>
          <div style={{ width: "100%" }}></div>
        </div>
        <div style={{ margin: "20px 0px" }}>
          {userInfo && <EditUser {...userInfo} />}
        </div>
      </section>
    </main>
  );
}
export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
