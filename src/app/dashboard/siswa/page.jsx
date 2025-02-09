"use client";
import { useState, useEffect } from "react";
import { getSiswa } from "../../../../lib/data";
import SiswaTable from "@/app/components/dashboard/siswa/SiswaTable";
import Pagination from "@/app/components/dashboard/siswa/Paginitation";
import Search from "@/app/components/dashboard/siswa/Search";
import { CreateButton } from "@/app/components/dashboard/siswa/Button";
import AuthGuard from "@/app/components/AuthGuard";

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
      <div className="max-w-screen-md w-full mx-auto mt-5 px-4">
        {/* Header: Search di tengah dan CreateButton di pojok kanan */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <Search />
          <CreateButton onSubmit={fetchSiswa} />
        </div>

        {/* Wrapper Tabel agar tidak overflow */}
        <div className="overflow-x-auto">
          <SiswaTable
            data={siswa}
            setData={setSiswa}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {loading && <h1 className="text-center font-bold mt-4">Loading...</h1>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

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

export default SiswaPage;
