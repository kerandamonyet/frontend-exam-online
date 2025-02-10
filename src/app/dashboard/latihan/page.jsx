"use client";
import { useState, useEffect } from "react";
import { getLatihan, getSiswa } from "../../../../lib/data";
import LatihanTable from "@/app/components/dashboard/latihan/LatihanTable";
import Pagination from "@/app/components/dashboard/latihan/Paginitation";
import Search from "@/app/components/dashboard/latihan/Search";
import AuthGuard from "@/app/components/AuthGuard";
import { IoAddSharp } from "react-icons/io5";
import Link from "next/link";

function LatihanPage() {
  const [latihan, setLatihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  useEffect(() => {
    fetchLatihan();
  }, [currentPage]);

  return (
    <AuthGuard>
      <div className="max-w-screen-md w-full mx-auto mt-5">
        <div className="flex items-center justify-between gap-1 mb-5">
          <Search />
          <Link href="/dashboard/latihan/create">
            <button className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-sm text-sm">
              <IoAddSharp size={20} />
              Create
            </button>
          </Link>
          {/* Perbarui tabel setelah create */}
        </div>
        <LatihanTable
          data={latihan}
          setData={setLatihan}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
        {loading && <h1 className="text-center font-bold">Loading...</h1>}
        {error && <p className="text-red-500">{error}</p>}

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
