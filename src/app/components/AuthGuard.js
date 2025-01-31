// components/AuthGuard.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthGuard = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Ambil token dari cookies
    const token = Cookies.get("auth-token");

    // Jika token tidak ada, redirect ke halaman login
    if (!token) {
      console.warn("❌ Token tidak ditemukan, redirect ke login.");
      router.push("/login-guru");
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;
