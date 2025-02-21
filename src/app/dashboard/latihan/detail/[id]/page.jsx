"use client";
import { useParams } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import CardDetail from "@/app/components/dashboard/latihan/CardDetail";
import { CreateButton } from "@/app/components/dashboard/soal/Button";
import Link from "next/link";
import SoalCard from "@/app/components/dashboard/soal/SoalCard";
import { RxPencil2 } from "react-icons/rx";

function DetailPage() {
  const params = useParams();
  const id_latihan = params?.id; // Ambil ID latihan dari URL
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <RxPencil2 className="text-blue-500 mr-2" /> Detail Latihan
            </h1>
          </header>

          {/* Card Detail Latihan */}
          <section className="bg-blue-200 shadow-lg rounded-lg p-6 grid grid-cols-1 gap-4">
            <CardDetail />

            {/* soal komponen */}
            <div className="mt-8 grid grid-rows-1 gap-4 card shadow-lg bordered-md p-5 rounded-md ">
              <div className="flex flex-1 justify-between">
                <h3>Soal</h3>
              </div>
              <div>
                <SoalCard id_latihan={id_latihan} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}

export default DetailPage;
