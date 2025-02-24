"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthGuardSiswa = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("auth-token"); // Sesuai dengan cookie yang digunakan

    if (!token) {
      console.warn("❌ Token tidak ditemukan, redirect ke login.");
      setTimeout(() => {
        router.push("/login-siswa");
      }, 500); // Tambahkan sedikit delay agar lebih smooth
    } else {
      setAuthorized(true);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memeriksa autentikasi...</p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};

export default AuthGuardSiswa;
