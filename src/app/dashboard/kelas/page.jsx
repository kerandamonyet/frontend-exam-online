"use client";
import { useState, useEffect } from "react";
import { getKelas } from "../../../../lib/data";
import KelasTable from "@/app/components/dashboard/kelas/KelasTable";
import Pagination from "@/app/components/dashboard/kelas/Paginitation";
import Search from "@/app/components/dashboard/kelas/Search";
import { CreateButton } from "@/app/components/dashboard/kelas/Button";
import AuthGuard from "@/app/components/AuthGuard";
import { BiLoaderAlt } from "react-icons/bi";
import { FaSchool } from "react-icons/fa";

function KelasPage() {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jumlahKelas, setJumlahKelas] = useState(0);

  const itemsPerPage = 10;

  const fetchKelas = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getKelas(currentPage, itemsPerPage);
      setKelas(data);
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
        setJumlahKelas(data.data.total_kelas);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchKelas();
    fetchStats();
  }, [currentPage]);

  return (
    <AuthGuard>
      <div className="max-w-screen-lg w-full mx-auto mt-5 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-md shadow-md border">
          <div className="flex items-center gap-3">
            <FaSchool className="text-blue-700" size={32} />
            <h1 className="text-lg font-semibold text-gray-700">
              Daftar Kelas - Kelola Data Kelas dengan Mudah!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <CreateButton onSubmit={fetchKelas} />
          </div>
        </div>

        {/* Statistik Total Siswa */}
        <div className="mt-4 bg-white p-4 rounded-md shadow border flex items-center gap-3">
          <FaSchool size={28} className="text-orange-600" />
          <div>
            <h2 className="text-sm text-gray-600">Total Kelas</h2>
            <p className="text-lg font-bold">{jumlahKelas}</p>
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

        {/* Tabel Data Siswa */}
        {!loading && !error && (
          <div className="overflow-x-auto mt-4 bg-white p-4 rounded-md shadow border">
            <KelasTable
              data={kelas}
              setData={setKelas}
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

export default KelasPage;
