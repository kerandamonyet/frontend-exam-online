"use client";
import React, { useState, useEffect, Children } from "react";
import { useRouter } from "next/navigation";
import BtnLogout from "../components/BtnLogout";
import AuthGuard from "../components/AuthGuard";
import NavbarGuru from "../components/guru/NavbarGuru";

const DashboardGuru = () => {
  return (
    <>
      <AuthGuard>
        <div className="flex flex-col">
        </div>
      </AuthGuard>
    </>
  );
};

export default DashboardGuru;
