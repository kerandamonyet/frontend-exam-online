"use client";
import { useState, useEffect } from "react";
import { getGuru } from "../../../../lib/data";
import GuruTable from "../../components/guru/GuruTable";
import Pagination from "@/app/components/guru/Paginitation";
import Search from "@/app/components/guru/Search";
import { CreateButton } from "@/app/components/guru/Button";
import NavbarGuru from "@/app/components/guru/NavbarGuru";

function GuruPage() {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman

  useEffect(() => {
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

    fetchGuru();
  }, [currentPage]); // Setiap perubahan halaman, ambil data baru

  return (
    <div className="max-w-screen-md w-full mx-auto mt-5">
      <div className="flex items-center justify-between gap-1 mb-5">
        <Search />
        <CreateButton />
      </div>
      <GuruTable data={guru} />
      {loading && <h1 className="text-center font-bold">Loading...</h1>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Pagination */}
      <div className="mt-5 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default GuruPage;
