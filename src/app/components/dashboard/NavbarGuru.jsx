"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import BtnLogout from "../BtnLogout";
import { TbLayoutDashboard, TbClipboardList, TbUsers } from "react-icons/tb";
import { FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";

import { usePathname } from "next/navigation";

const NavbarGuru = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <TbLayoutDashboard size={20} />,
    },
    {
      name: "Latihan",
      href: "/dashboard/latihan",
      icon: <TbClipboardList size={20} />,
    },
    {
      name: "Kelas",
      href: "/dashboard/kelas",
      icon: <FaSchool size={20} />,
    },
    {
      name: "Siswa",
      href: "/dashboard/siswa",
      icon: <TbUsers size={20} />,
    },
    {
      name: "Guru",
      href: "/dashboard/guru",
      icon: <FaChalkboardTeacher size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 right-4 p-2 z-50 bg-white rounded-lg shadow"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        <Image
          src={isOpen ? "/icon/X-icon.svg" : "/icon/hamburger-icon.svg"}
          alt="Menu Toggle"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-[#000957] shadow-lg z-40 transform transition-transform duration-200 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          w-4/5 md:w-1/3 lg:w-1/4 lg:translate-x-0 lg:static`}
      >
        <div className="p-6 border-b border-gray-600">
          <h1 className="text-2xl font-bold text-white">SiapUjian</h1>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 
                  ${
                    isActive
                      ? "bg-gray-200 text-[#000957] font-semibold"
                      : "text-white hover:bg-gray-100 hover:text-[#000957]"
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
          <BtnLogout />
        </nav>
      </aside>
    </>
  );
};

export default NavbarGuru;
