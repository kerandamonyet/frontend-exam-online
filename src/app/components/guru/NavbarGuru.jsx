"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import BtnLogout from "../BtnLogout";

const NavbarGuru = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "/icon/dashboard.svg" },
    { name: "Latihan", href: "/dashboard/latihan" },
    { name: "Siswa", href: "/dashboard/siswa" },
    { name: "Guru", href: "/dashboard/guru" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 right-4 p-2 z-50 bg-white rounded-lg shadow"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? (
          <Image
            src="/icon/X-icon.svg"
            alt="Close menu"
            width={24}
            height={24}
            priority
            className="w-6 h-6"
          />
        ) : (
          <Image
            src="/icon/hamburger-icon.svg"
            alt="Open menu"
            width={24}
            height={24}
            priority
            className="w-6 h-6"
          />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={` p-4 fixed inset-y-0 left-0 w-1/4 bg-[#000957] shadow-lg z-40 transform transition-transform duration-200 ease-in-out 
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-white">SiapUjian</h1>
        </div>

        <nav className="px-4 space-y-1 mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center w-full px-4 py-2 font-light text-white rounded-lg hover:bg-gray-100 hover:text-[#000957] hover:font-bold group"
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={20}
                height={20}
                className=" aside-icon mr-3 transition-all duration-200 group-hover:fill-[#000957]"
              />
              <span className="flex-1">{item.name}</span>
            </Link>
          ))}
          <BtnLogout />
        </nav>
      </aside>
    </>
  );
};

export default NavbarGuru;
