import React, { useEffect, useRef, useState } from "react";
import "boxicons/css/boxicons.min.css";
import { protectRoute } from "@/utils/auth";
import initializeSidebar from "/components/script";
import axios from "axios";
import { useRouter } from "next/router";

export default function SuperAdminNavbar({ session }) {
  const [image, setImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/admin/logout", {
      method: "POST",
    });

    if (res.ok) {
      await router.push("/super-admin/auth/login");
    } else {
      // handle error
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/manage-profile/profile", {
          withCredentials: true,
        });
        const { image } = response.data.userAgency;
        setImage(image);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    initializeSidebar();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 0) {
          navbar.classList.add("hidden");
        } else {
          navbar.classList.remove("hidden");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function Profile() {
    router.push("/super-admin/dashboard/profile");
  }
  return (
    <nav className="navbar" style={{ justifyContent: "space-between" }}>
      <i className="bx bx-menu"></i>
      <span className="text-xl font-bold">Hi, {session.name}</span>
      <button
        className="flex items-center text-black gap-2 hover:text-blue-600 transition-all duration-600 ease-linear -mr-6"
        onClick={toggleDropdown}
      >
        {image ? (
          <img
            src={image}
            alt="Profile Picture"
            className="ml-4 rounded-full h-12 w-12"
          />
        ) : (
          <div className="ml-4 w-10 h-10 object-cover rounded-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-lg">
              <img src="/avatar.jpg" alt="img" />
            </span>
          </div>
        )}
      </button>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-md overflow-hidden"
        >
          <button
            onClick={Profile}
            className="text-left block px-4 py-2 cursor-pointer hover:bg-blue-600 w-full"
          >
            My Account
          </button>
          <button
            onClick={handleLogout}
            className="text-left block px-4 py-2 w-full hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export const getServerSideProps = (ctx) => {
  return protectRoute(ctx, ["superAdmin"]);
};
