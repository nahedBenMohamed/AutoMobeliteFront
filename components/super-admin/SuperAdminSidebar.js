import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SuperAdminSidebar() {
  const inactiveLink = "flex gap-1 p-1";
  const activeLink = inactiveLink + " bg-white text-blue-900 rounded-l-lg";
  const router = useRouter();
  const { pathname } = router;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/super-admin/logout", {
        method: "POST",
      });

      if (res.ok) {
        await router.push("/super-admin/auth/login");
      } else {
        // handle error
      }
    } catch (error) {
      // handle error
    }
  };

  return (
    <section id="sidebar">
      <Link
        href="/super-admin/dashboard/home"
        className={`brand ${pathname === "/" ? activeLink : inactiveLink}`}
      >
        <img src={"/mobelite.png"} alt="logo" />
        <span className="text">Automobelite</span>
      </Link>

      <ul className="side-menu top">
        <li
          className={pathname === "/super-admin/dashboard/home" ? "active" : ""}
        >
          <Link href="/super-admin/dashboard/home">
            <i class="bx bxs-home-smile"></i>
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li
          className={pathname === "/super-admin/dashboard/cars" ? "active" : ""}
        >
          <Link href="/super-admin/dashboard/cars">
            <i class="bx bxs-car"></i>
            <span className="text">My Cars</span>
          </Link>
        </li>
        <li
          className={
            pathname === "/super-admin/dashboard/users" ? "active" : ""
          }
        >
          <Link href="/super-admin/dashboard/users">
            <i className="bx bxs-group"></i>
            <span className="text">Users</span>
          </Link>
        </li>
        <li
          className={
            pathname === "/super-admin/dashboard/manage" ? "active" : ""
          }
        >
          <Link href="/super-admin/dashboard/manage">
            <i className="bx bx-cog"></i>
            <span className="text">Manage</span>
          </Link>
        </li>
        <li className={pathname === "/admin/dashboard/users" ? "active" : ""}>
          <Link href="/super-admin/dashboard/maintenance">
            <i className="bx bxs-cog"></i>
            <span className="text">Maintenance</span>
          </Link>
        </li>
        <li
          className={
            pathname === "/super-admin/dashboard/parking" ? "active" : ""
          }
        >
          <Link href="/super-admin/dashboard/parking">
            <i className="bx bxs-parking"></i>
            <span className="text">Parking</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
