"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSoalByIdSoal } from "../../../../../../../lib/data";
import EditForm from "@/app/components/dashboard/soal/EditForm";

function EditSoalPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data soal berdasarkan id menggunakan fungsi dari lib/data
  useEffect(() => {
    if (!id) {
      setError("ID soal tidak valid");
      setIsLoading(false);
      return;
    }

    const fetchSoal = async () => {
      try {
        const result = await getSoalByIdSoal(id);

        // Validasi data yang diterima dari API
        if (result.data && result.data.length > 0) {
          setInitialData(result.data[0]);
        } else {
          setError("Soal tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching soal:", err);
        setError("Terjadi kesalahan saat mengambil data soal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoal();
  }, [id]);

  // Setelah berhasil update, arahkan kembali ke daftar soal
  const handleSubmit = () => {
    router.push("/dashboard/soal");
  };

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
        <button
          onClick={() => router.push("/dashboard/soal")}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Kembali ke Daftar Soal
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <p>Loading...</p>
        {/* Anda bisa menambahkan spinner atau indikator loading lainnya di sini */}
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="p-4">
        <p>Data soal tidak tersedia.</p>
        <button
          onClick={() => router.push("/dashboard/soal")}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Kembali ke Daftar Soal
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <EditForm id={id} initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditSoalPage;
