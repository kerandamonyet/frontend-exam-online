"use client";

import { useRouter } from "next/navigation";
import FormValidasi from "../components/biodata/FormValidasi";
import InstruksiValidasi from "../components/biodata/InstruksiValidasi";
import AuthGuardSiswa from "../components/AuthGuardSiswa";

function BiodataPage() {
  const router = useRouter();

  const handleSubmitSuccess = (id_latihan) => {
    router.push(`/soal/${id_latihan}`);
  };

  return (
    <AuthGuardSiswa>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              Validasi Biodata
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Silakan periksa dan lengkapi data diri Anda sebelum melanjutkan ke
              halaman ujian
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Instructions */}
            <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="h-3 bg-blue-600 w-full"></div>
              <div className="p-6 sm:p-8">
                <InstruksiValidasi />
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="h-3 bg-green-600 w-full"></div>
              <div className="p-6 sm:p-8">
                <FormValidasi onSubmitSuccess={handleSubmitSuccess} />
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Butuh bantuan? Hubungi guru pembimbing atau administrator sistem
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthGuardSiswa>
  );
}

export default BiodataPage;
