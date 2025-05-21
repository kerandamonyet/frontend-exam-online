"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllSoal,
  getLatihan,
  getSiswa,
  getSoalByIdSoal,
  getSoalByLatihanId,
} from "../../../../lib/data";
import SortirByLatihan from "@/app/components/dashboard/soal/SortirByLatihan";
import SoalCard from "@/app/components/dashboard/soal/SoalCard";
import Pagination from "@/app/components/dashboard/soal/Paginitation";
import Search from "@/app/components/dashboard/soal/Search";
import AuthGuard from "@/app/components/AuthGuard";

import { IoAddSharp } from "react-icons/io5";
import { TbClipboardList, TbUsers } from "react-icons/tb";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import { FaRegQuestionCircle } from "react-icons/fa";

function SoalPage() {
  const [soal, setSoal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Statistik
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahLatihan, setJumlahLatihan] = useState(0);
  const [jumlahSoal, setJumlahSoal] = useState(0);

  // Ambil semua soal (default)
  const fetchSoal = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getAllSoal(currentPage, itemsPerPage);
      setSoal(data);
      setTotalPages(totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ambil statistik (misalnya total siswa, latihan dan soal)
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
        setJumlahSoal(data.data.total_soal);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Panggil saat komponen mount atau currentPage berubah
  useEffect(() => {
    fetchSoal();
    fetchStats();
  }, [currentPage]);

  /**
   * Fungsi untuk mem-filter soal berdasarkan latihan_id
   * Jika latihanId === null -> tampilkan semua soal (reset filter)
   * Jika ada latihanId -> panggil getSoalByLatihanId
   */
  const handleFilterSoalByLatihan = async (latihanId) => {
    setLoading(true);
    setError(null);
    try {
      if (!latihanId) {
        // Tampilkan semua soal (reset filter)
        const { data, totalPages } = await getAllSoal(
          currentPage,
          itemsPerPage
        );
        setSoal(data);
        setTotalPages(totalPages);
      } else {
        // Filter soal sesuai latihan_id
        // (Jika API getSoalByLatihanId tidak mendukung pagination, Anda bisa menonaktifkan pagination)
        const { data } = await getSoalByLatihanId(latihanId);
        setSoal(data);
        setTotalPages(1); // atau sesuaikan sesuai kebutuhan
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-screen-lg w-full mx-auto mt-5 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-md shadow-md border">
          <div className="flex items-center gap-3">
            <HiOutlinePencilAlt className="text-blue-700" size={32} />
            <h1 className="text-lg font-semibold text-gray-700">
              Daftar Soal - Kelola Data Soal dengan Mudah!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/soal/create">
              <button className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-md text-sm shadow-md transition-all">
                <IoAddSharp size={20} />
                <span>Create</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-4 grid grid-cols-3 gap-4 xs:grid-cols-1">
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

          {/* Statistik Total Soal */}
          <div className="mt-4 bg-white p-4 rounded-md shadow border flex items-center gap-3">
            <FaRegQuestionCircle size={28} className="text-blue-600" />
            <div>
              <h2 className="text-sm text-gray-600">Total Soal</h2>
              <p className="text-lg font-bold">{jumlahSoal}</p>
            </div>
          </div>
        </div>

        {/* Komponen Sortir By Latihan */}
        <div className="mt-4">
          <SortirByLatihan onFilter={handleFilterSoalByLatihan} />
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

        {/* Tabel Data Soal */}
        {!loading && !error && (
          <div className="overflow-x-auto mt-4 bg-white p-4 rounded-md shadow border">
            <SoalCard
              data={soal}
              setData={setSoal}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}

        {/* Pagination (opsional, tergantung apakah API filter mendukung pagination) */}
        {!loading && !error && (
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

export default SoalPage;
