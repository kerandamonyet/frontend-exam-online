"use client";
import React from "react";
import FormCreate from "@/app/components/dashboard/latihan/FormCreate"; // Sesuaikan path sesuai struktur proyek Anda

function CreatePage() {
  // Callback ketika form berhasil disubmit
  const handleFormSubmit = () => {
    // Misalnya, Anda bisa mengarahkan pengguna kembali ke halaman daftar atau menampilkan notifikasi
    console.log("Room Latihan berhasil dibuat!");
    // Contoh: menggunakan router untuk redirect (jika menggunakan react-router-dom)
    // navigate("/latihan");
  };

  return (
    <div className="max-w-screen-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Room Latihan</h1>
      <FormCreate onSubmit={handleFormSubmit} />
    </div>
  );
}

export default CreatePage;
