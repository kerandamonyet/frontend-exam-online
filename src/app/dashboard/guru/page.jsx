"use client";
import { useState, useEffect } from "react";
import { getGuru } from "../../../../lib/data";
import GuruTable from "../../components/dashboard/guru/GuruTable";
import Pagination from "@/app/components/dashboard/guru/Paginitation";
import Search from "@/app/components/dashboard/guru/Search";
import { CreateButton } from "@/app/components/dashboard/guru/Button";
import NavbarGuru from "@/app/components/dashboard/guru/NavbarGuru";
import AuthGuard from "@/app/components/AuthGuard";

function GuruPage() {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    fetchGuru();
  }, [currentPage]);

  return (
    <AuthGuard>
      <div className="max-w-screen-md w-full mx-auto mt-5">
        <div className="flex items-center justify-between gap-1 mb-5">
          <Search />
          <CreateButton onSubmit={fetchGuru} />{" "}
          {/* Perbarui tabel setelah create */}
        </div>
        <GuruTable
          data={guru}
          setData={setGuru}
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

export default GuruPage;
