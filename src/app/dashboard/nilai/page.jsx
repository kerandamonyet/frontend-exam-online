"use client";
import { useState, useEffect } from "react";
import { getAllHasilSiswa, getAllSesiLatihan, getLatihan, getSiswa } from "../../../../lib/data";
import NilaiTable from "@/app/components/dashboard/nilai/NilaiTable";
import Pagination from "@/app/components/dashboard/nilai/Paginitation";
import Search from "@/app/components/dashboard/nilai/Search";
import AuthGuard from "@/app/components/AuthGuard";
import { IoAddSharp } from "react-icons/io5";
import { TbClipboardList, TbUsers } from "react-icons/tb";
import { MdOutlineQuiz } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";
import Link from "next/link";

function NilaiPage() {
  const [nilai, setNilai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahLatihan, setJumlahLatihan] = useState(0);
  const itemsPerPage = 5;

  const fetchNilai = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getAllHasilSiswa(currentPage, itemsPerPage);
      setNilai(data);
      setTotalPages(totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats/total");

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setJumlahSiswa(data.data.total_siswa);
        setJumlahLatihan(data.data.total_latihan);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchNilai();
    fetchStats();
  }, [currentPage]);

  return (
    <AuthGuard>
      <div className="max-w-screen-lg w-full mx-auto mt-5 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-md shadow-md border">
          <div className="flex items-center gap-3">
            <TbUsers className="text-blue-700" size={32} />
            <h1 className="text-lg font-semibold text-gray-700">
              Daftar Sesi Latihan - Kelola Data Sesi Latihan dengan Mudah!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Search />
            <Link href="/dashboard/latihan/create">
              <button className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-md text-sm shadow-md transition-all">
                <IoAddSharp size={20} />
                <span>Create</span>
              </button>
            </Link>{" "}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* Statistik Total Latihan */}
          <div className="mt-4 bg-white p-4 rounded-md shadow border flex items-center gap-3">
            <TbClipboardList size={28} className="text-green-600" />
            <div>
              <h2 className="text-sm text-gray-600">Total Latihan</h2>
              <p className="text-lg font-bold">{jumlahLatihan}</p>
            </div>
          </div>

          {/* Statistik Total Siswa */}
          <div className="mt-4 bg-white p-4 rounded-md shadow border flex items-center gap-3">
            <TbUsers size={28} className="text-orange-600" />
            <div>
              <h2 className="text-sm text-gray-600">Total Siswa</h2>
              <p className="text-lg font-bold">{jumlahSiswa}</p>
            </div>
          </div>
        </div>

        {/* Loading & Error Handling */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-6">
            <BiLoaderAlt size={40} className="text-blue-600 animate-spin" />
            <p className="text-gray-500 mt-2 animate-pulse">Memuat data...</p>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mt-4 p-3 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        {/* Tabel Data Latihan */}
        {!loading && !error && (
          <div className="overflow-x-auto mt-4 bg-white p-4 rounded-md shadow border">
            <NilaiTable
              data={nilai}
              setData={setNilai}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="mt-5 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

export default NilaiPage;
