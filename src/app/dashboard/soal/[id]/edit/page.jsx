"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import EditForm from "@/app/components/dashboard/soal/EditForm";
import { getSoalByIdSoal } from "../../../../../../lib/data";

function EditSoalPage() {
  const router = useRouter();
  const { id } = useParams(); // Mendapatkan id dari URL
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data soal berdasarkan id dari backend
  useEffect(() => {
    if (!id) {
      setError("ID soal tidak valid");
      setIsLoading(false);
      return;
    }

    const fetchSoal = async () => {
      try {
        const result = await getSoalByIdSoal(id);
        // Perbaiki validasi: jika result.data ada, anggap data valid
        if (result.data) {
          setInitialData(result.data);
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
