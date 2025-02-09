"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BtnLogout from "../components/BtnLogout";
import AuthGuard from "../components/AuthGuard";
import NavbarGuru from "../components/dashboard/guru/NavbarGuru";
import Card from "../components/dashboard/Card";

const DashboardGuru = () => {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        {/* <NavbarGuru /> */}

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100">
          {/* Header */}
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard Guru</h1>
            <BtnLogout />
          </header>

          {/* Content Area */}
          <section className="bg-white p-6 rounded shadow">
            <p>Selamat datang di Dashboard Guru!</p>
            {/* Tambahkan konten dashboard Anda di sini */}
            <Card jumlahSiswa={120} jumlahGuru={25} />
          </section>
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardGuru;
