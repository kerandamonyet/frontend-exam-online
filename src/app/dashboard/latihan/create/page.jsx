"use client";
import React from "react";
import { useRouter } from "next/navigation";
import FormCreate from "@/app/components/dashboard/latihan/FormCreate"; // Sesuaikan path sesuai struktur proyek Anda
import AuthGuard from "@/app/components/AuthGuard";

function CreatePage() {
  const router = useRouter();

  // Callback ketika form berhasil disubmit
  const handleFormSubmit = () => {
    console.log("Room Latihan berhasil dibuat!");
    router.push("/dashboard/latihan");
  };

  return (
    <AuthGuard>
      <div className="max-w-screen-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create Room Latihan</h1>
        <FormCreate onSubmit={handleFormSubmit} />
      </div>
    </AuthGuard>
  );
}

export default CreatePage;
