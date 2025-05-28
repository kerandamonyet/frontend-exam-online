import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <main className="flex-grow py-8 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-4 animate-fadeIn">
              Selamat Datang di <span className="text-blue-800">SiapUjian</span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 text-lg md:text-xl mb-6">
                Platform ujian online terpercaya untuk meningkatkan kualitas
                pembelajaran dan evaluasi siswa secara terintegrasi
              </p>
              <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-8">
              Pilih peran Anda untuk melanjutkan:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Login Siswa Card */}
              <div className="group">
                <Link href="/login-siswa" passHref>
                  <div className="bg-white h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100 flex flex-col">
                    {/* Top Color Bar */}
                    <div className="h-3 bg-blue-600 w-full"></div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8 flex flex-col items-center flex-grow">
                      <div className="mb-6 mt-2 p-6 bg-blue-100 rounded-full transform group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/icon/siswa.png"
                          alt="Siswa"
                          width={100}
                          height={100}
                          className="object-contain"
                          priority
                        />
                      </div>

                      <h3 className="text-2xl font-bold text-blue-600 mb-4">
                        Siswa
                      </h3>

                      <p className="text-gray-600 mb-6 text-center">
                        Akses soal ujian, latihan interaktif, dan pantau
                        kemajuan belajar Anda dengan mudah dan menyenangkan.
                      </p>

                      <div className="mt-auto">
                        <div className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md">
                          Masuk sebagai Siswa
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Login Guru Card */}
              <div className="group">
                <Link href="/login-guru" passHref>
                  <div className="bg-white h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-100 flex flex-col">
                    {/* Top Color Bar */}
                    <div className="h-3 bg-green-600 w-full"></div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8 flex flex-col items-center flex-grow">
                      <div className="mb-6 mt-2 p-6 bg-green-100 rounded-full transform group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/icon/guru.png"
                          alt="Guru"
                          width={100}
                          height={100}
                          className="object-contain"
                          priority
                        />
                      </div>

                      <h3 className="text-2xl font-bold text-green-600 mb-4">
                        Guru
                      </h3>

                      <p className="text-gray-600 mb-6 text-center">
                        Kelola soal ujian, analisis hasil evaluasi siswa, dan
                        pantau perkembangan pembelajaran secara real-time.
                      </p>

                      <div className="mt-auto">
                        <div className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-md">
                          Masuk sebagai Guru
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 md:mt-24 max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-10">
              Keunggulan Platform Kami
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="w-12 h-12 mb-4 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Ujian Interaktif
                </h3>
                <p className="text-gray-600">
                  Soal-soal interaktif dengan berbagai format yang menarik dan
                  menyenangkan.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="w-12 h-12 mb-4 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Analisis Hasil
                </h3>
                <p className="text-gray-600">
                  Laporan detail dan visualisasi kemajuan belajar yang mudah
                  dipahami.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="w-12 h-12 mb-4 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Keamanan Terjamin
                </h3>
                <p className="text-gray-600">
                  Sistem keamanan ujian yang terpercaya dan anti kecurangan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
