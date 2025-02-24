"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import BtnLogout from "../BtnLogout";
import {
  TbLayoutDashboard,
  TbClipboardList,
  TbUsers,
  TbCertificate,
  TbBook,
  TbClipboardCheck,
} from "react-icons/tb";
import { FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";
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

  // Kategori menu
  const menuCategories = [
    {
      title: "Dashboard",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: <TbLayoutDashboard size={20} />,
        },
      ],
    },
    {
      title: "Manajemen Ujian",
      items: [
        {
          name: "Latihan",
          href: "/dashboard/latihan",
          icon: <TbClipboardList size={20} />,
        },
        {
          name: "Soal",
          href: "/dashboard/soal",
          icon: <HiOutlinePencilAlt size={20} />,
        },
        {
          name: "Latihan Soal",
          href: "/dashboard/latihan-soal",
          icon: <TbBook size={20} />,
        },
        {
          name: "Sesi Latihan",
          href: "/dashboard/sesi-latihan",
          icon: <TbClipboardCheck size={20} />,
        },
      ],
    },
    {
      title: "Manajemen Kelas & Siswa",
      items: [
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
      ],
    },
    {
      title: "Nilai & Evaluasi",
      items: [
        {
          name: "Nilai",
          href: "/dashboard/nilai",
          icon: <TbCertificate size={20} />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 right-4 p-2 z-50 bg-white rounded-lg shadow-lg"
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
        className={`fixed inset-y-0 left-0 bg-[#001F54] shadow-lg z-40 transform transition-transform duration-200 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          w-4/5 md:w-1/3 lg:w-1/4 lg:translate-x-0 lg:static`}
      >
        <div className="p-6 border-b border-gray-600">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            SiapUjian
          </h1>
        </div>

        <nav className="px-4 space-y-2 mt-4 font-sans">
          {menuCategories.map((category, index) => (
            <div key={index} className="mt-4">
              <h2 className="text-gray-400 uppercase text-xs font-semibold tracking-wider px-4 mb-2">
                {category.title}
              </h2>
              {category.items.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-sm mb-3
                      ${
                        isActive
                          ? "bg-[#4F86F7] text-white"
                          : "text-gray-300 hover:bg-[#4F86F7]/20 hover:text-white"
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="mt-6 border-t border-gray-600 pt-3">
            <BtnLogout />
          </div>
        </nav>
      </aside>
    </>
  );
};

export default NavbarGuru;
