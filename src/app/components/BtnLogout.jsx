import React, { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"; // Perbaikan: impor useRouter
import { BiLogOut } from "react-icons/bi";

function BtnLogout() {
  const [pending, setPending] = useState(false);
  const router = useRouter(); // Perbaikan: inisialisasi router

  const handleLogout = async () => {
    setPending(true);
    console.log("🔄 [LOGOUT] Menghapus token dan logout...");

    try {
      // Hapus token dari cookies
      Cookies.remove("auth-token");

      // Tampilkan pesan sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Logout berhasil!",
      });

      // Redirect ke halaman login setelah logout berhasil
      router.push("/login-guru"); // Pastikan router.push digunakan di dalam komponen yang didukung Next.js
    } catch (error) {
      console.error("❌ [LOGOUT] Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Logout Gagal",
        text: "Terjadi kesalahan, coba lagi nanti.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="">
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="relative flex flex-1 justify-center gap-4 w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        <BiLogOut size={20}/>
        {pending ? "Logging out..." : " Logout"}
      </button>
    </div>
  );
}

export default BtnLogout;
