"use client";
import { useState, useEffect } from "react";
import { getGuru } from "../../../../lib/data";
import GuruTable from "@/app/components/dashboard/guru/GuruTable";
import Pagination from "@/app/components/dashboard/guru/Paginitation";
import Search from "@/app/components/dashboard/guru/Search";
import { CreateButton } from "@/app/components/dashboard/guru/Button";
import AuthGuard from "@/app/components/AuthGuard";
import { BiLoaderAlt } from "react-icons/bi";
import { FaChalkboardTeacher } from "react-icons/fa";

function GuruPage() {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jumlahGuru, setJumlahGuru] = useState(0);

  const itemsPerPage = 10;

  const fetchGuru = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getGuru(currentPage, itemsPerPage);
      setGuru(data);
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
        setJumlahGuru(data.data.total_guru);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchGuru();
    fetchStats();
  }, [currentPage]);

  return (
    <AuthGuard>
      <div className="max-w-screen-lg w-full mx-auto mt-5 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-md shadow-md border">
          <div className="flex items-center gap-3">
            <FaChalkboardTeacher className="text-blue-700" size={32} />
            <h1 className="text-lg font-semibold text-gray-700">
              Daftar Guru - Kelola Data guru dengan Mudah!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Search />
            <CreateButton onSubmit={fetchGuru} />
          </div>
        </div>

        {/* Statistik Total Guru */}
        <div className="mt-4 bg-white p-4 rounded-md shadow border flex items-center gap-3">
          <FaChalkboardTeacher size={28} className="text-orange-600" />
          <div>
            <h2 className="text-sm text-gray-600">Total Guru</h2>
            <p className="text-lg font-bold">{jumlahGuru}</p>
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

        {/* Tabel Data guru */}
        {!loading && !error && (
          <div className="overflow-x-auto mt-4 bg-white p-4 rounded-md shadow border">
            <GuruTable
              data={guru}
              setData={setGuru}
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

export default GuruPage;
