import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function HomePage() {
  return (
    <>
    <Navbar/>
    <div className="bg-white p-4 sm:p-6 md:p-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#026EE8] text-center mb-4">
        Selamat Datang di SiapUjian
      </h2>
      <p className="text-center text-black mb-8 text-sm sm:text-base md:text-lg font-medium">
        Pilih salah satu peran Anda untuk melanjutkan ke halaman login yang
        sesuai.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 md:px-12 lg:px-48 py-10">
        {/* Login Siswa */}
        <div className="flex flex-col items-center mx-auto text-center bg-[#026EE8] rounded-xl shadow-md">
          <div className=" p-6 py-8 w-full max-w-md">
            <Link href="/login-siswa" passHref>
              <div className="flex justify-center mb-4">
                <Image
                  src="/icon/siswa.png"
                  alt="siswa icon"
                  width={100}
                  height={100}
                  priority
                />
              </div>
              <h3 className="text-center text-xl sm:text-2xl font-bold text-white mb-4">
                Login Siswa
              </h3>
              <p className="text-white font-semibold mt-5 mb-4">
                Akses soal ujian, latihan, dan pantau progres Anda. Tingkatkan
                pemahaman melalui simulasi ujian berbasis komputer.
              </p>
            </Link>
          </div>
        </div>

        {/* Login Guru */}
        <div className="flex flex-col items-center mx-auto text-center bg-green-500 rounded-xl shadow-md">
          <div className="border p-6 py-8 w-full max-w-md">
            <Link
              href="/login-guru"
              passHref
              className="text-center rounded-lg shadow-md w-full max-w-md"
            >
              <div className="flex justify-center mb-4">
                <Image
                  src="/icon/guru.png"
                  alt="guru icon"
                  width={100}
                  height={100}
                  priority
                />
              </div>
              <h3 className="text-center text-xl sm:text-2xl font-bold text-white mb-4">
                Login Guru
              </h3>
              <p className="text-white font-semibold mt-5 mb-4">
                Kelola soal ujian, lihat hasil evaluasi siswa, dan pantau
                kemajuan mereka secara real-time melalui sistem yang
                terintegrasi.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default HomePage;
