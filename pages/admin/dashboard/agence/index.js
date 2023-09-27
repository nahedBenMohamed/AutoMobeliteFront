import { protectRoute } from "@/utils/auth";
import React from "react";
import MyAgence from "@/components/admin/my-agence";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

export default function SuperAdminNewAgence({ session }) {
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
            My Agency {"\u{1F3E2}"}
          </h1>
          <div style={{ width: "100%" }}></div>
        </div>
        <div style={{ margin: "20px 10px" }}>
          <MyAgence session={session} />
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["admin"]);
};
