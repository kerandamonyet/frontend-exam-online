"use client";

import { useRouter } from "next/navigation";
import FormValidasi from "../components/biodata/FormValidasi";
import InstruksiValidasi from "../components/biodata/InstruksiValidasi";
import AuthGuardSiswa from "../components/AuthGuardSiswa";

function BiodataPage() {
  const router = useRouter();

  const handleSubmitSuccess = (id_latihan) => {
    router.push(`/soal/${id_latihan}`); // Menggunakan backtick dan interpolasi
  };

  return (
    <AuthGuardSiswa>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
        <div className="w-full md:w-[70%] p-6 bg-white border border-gray-200 rounded-xl shadow-md">
          <InstruksiValidasi />
        </div>
        <div className="w-full md:w-[30%] p-6 bg-white border border-gray-200 rounded-xl shadow-md">
          <FormValidasi onSubmitSuccess={handleSubmitSuccess} />
        </div>
      </div>
    </AuthGuardSiswa>
  );
}

export default BiodataPage;
