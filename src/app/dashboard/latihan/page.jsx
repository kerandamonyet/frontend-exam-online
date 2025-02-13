"use client";
import { useState, useEffect } from "react";
import { getLatihan, getSiswa } from "../../../../lib/data";
import LatihanTable from "@/app/components/dashboard/latihan/LatihanTable";
import Pagination from "@/app/components/dashboard/latihan/Paginitation";
import Search from "@/app/components/dashboard/latihan/Search";
import AuthGuard from "@/app/components/AuthGuard";
import { IoAddSharp } from "react-icons/io5";
import { TbClipboardList, TbUsers } from "react-icons/tb";
import { MdOutlineQuiz } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";
import Link from "next/link";

function LatihanPage() {
  const [latihan, setLatihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const itemsPerPage = 5;

  const fetchLatihan = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getLatihan(currentPage, itemsPerPage);
      setLatihan(data);
      setTotalPages(totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiswa = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats/total");

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setJumlahSiswa(data.data.total_siswa);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchLatihan();
    fetchSiswa();
  }, [currentPage]);

  return (
    <AuthGuard>
      <div className="max-w-screen-md w-full mx-auto mt-5">
        {/* Header dengan ikon */}
        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-md shadow-md border">
          <MdOutlineQuiz className="text-blue-700" size={32} />
          <h1 className="text-lg font-semibold text-gray-700">
            Latihan Soal - Kelola Latihan Ujian Dengan Mudah!
          </h1>
        </div>

        {/* Statistik singkat */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md shadow border flex items-center gap-3">
            <TbClipboardList size={28} className="text-green-600" />
            <div>
              <h2 className="text-sm text-gray-600">Total Latihan</h2>
              <p className="text-lg font-bold">{latihan.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow border flex items-center gap-3">
            <TbUsers size={28} className="text-orange-600" />
            <div>
              <h2 className="text-sm text-gray-600">Total Siswa</h2>
              <p className="text-lg font-bold">{jumlahSiswa}</p>
            </div>
          </div>
        </div>

        {/* Pencarian dan tombol Create */}
        <div className="flex items-center justify-between gap-1 mt-6">
          <Search />
          <Link href="/dashboard/latihan/create">
            <button className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-md text-sm shadow-md transition-all">
              <IoAddSharp size={20} />
              <span>Create</span>
            </button>
          </Link>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-6">
            <BiLoaderAlt size={40} className="text-blue-600 animate-spin" />
            <p className="text-gray-500 mt-2 animate-pulse">Memuat data...</p>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Tabel Latihan */}
        {!loading && (
          <div className="mt-4 bg-white p-4 rounded-md shadow border">
            <LatihanTable
              data={latihan}
              setData={setLatihan}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        {/* Pagination */}
        <div className="mt-5 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </AuthGuard>
  );
}

export default LatihanPage;
