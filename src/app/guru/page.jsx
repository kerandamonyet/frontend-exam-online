"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BtnLogout from "../components/BtnLogout";
import AuthGuard from "../components/AuthGuard";

const DashboardGuru = () => {
  return (
    <>
      <AuthGuard>
        <div>
          <h1>Selamat datang di Dashboard Guru</h1>
          {/* Konten dashboard */}
          <BtnLogout />
        </div>
      </AuthGuard>
    </>
  );
};

export default DashboardGuru;
