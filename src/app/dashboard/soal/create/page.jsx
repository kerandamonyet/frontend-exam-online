"use client";
import React from "react";
import { useRouter } from "next/navigation";
import FormCreate from "@/app/components/dashboard/soal/FormCreate"; // Sesuaikan path sesuai struktur proyek Anda
import AuthGuard from "@/app/components/AuthGuard";

function CreateSoalPage() {
    const router = useRouter();
    const handleFormSubmit = () => {
    console.log("Soal berhasil dibuat!");
    router.push("/dashboard/soal");
  };

  return (
    <AuthGuard>
      <div className="max-w-screen-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create Soal</h1>
        <FormCreate onSubmit={handleFormSubmit} />
      </div>
    </AuthGuard>
  );
}

export default CreateSoalPage;
