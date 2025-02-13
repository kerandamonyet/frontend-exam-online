"use client";
import { useState, useEffect } from "react";
import { getSiswa } from "../../../../lib/data";
import SiswaTable from "@/app/components/dashboard/siswa/SiswaTable";
import Pagination from "@/app/components/dashboard/siswa/Paginitation";
import Search from "@/app/components/dashboard/siswa/Search";
import { CreateButton } from "@/app/components/dashboard/siswa/Button";
import AuthGuard from "@/app/components/AuthGuard";
import { BiLoaderAlt } from "react-icons/bi";
import { TbUsers } from "react-icons/tb";

function SiswaPage() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchSiswa = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getSiswa(currentPage, itemsPerPage);
      setSiswa(data);
      setTotalPages(totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, [currentPage]);

  return (
    <AuthGuard>
      <div className="max-w-screen-lg w-full mx-auto mt-5 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-md shadow-md border">
          <div className="flex items-center gap-3">
            <TbUsers className="text-blue-700" size={32} />
            <h1 className="text-lg font-semibold text-gray-700">
              Daftar Siswa - Kelola Data Siswa dengan Mudah!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Search />
            <CreateButton onSubmit={fetchSiswa} />
          </div>
        </div>

        {/* Statistik Total Siswa */}
        <div className="mt-4 bg-white p-4 rounded-md shadow border flex items-center gap-3">
          <TbUsers size={28} className="text-orange-600" />
          <div>
            <h2 className="text-sm text-gray-600">Total Siswa</h2>
            <p className="text-lg font-bold">{siswa.length}</p>
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
            <SiswaTable
              data={siswa}
              setData={setSiswa}
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

export default SiswaPage;
