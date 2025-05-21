"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TentangKami() {
  // Animasi sederhana untuk elemen halaman
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const faqs = [
    {
      question: "Apa itu ANBK?",
      answer:
        "ANBK adalah Asesmen Nasional Berbasis Komputer. Ini adalah ujian yang dilakukan menggunakan komputer untuk melihat kemampuan kamu dalam belajar.",
    },
    {
      question: "Apakah belajar di SiapUjian menyenangkan?",
      answer:
        "Tentu saja! Kami punya banyak game, animasi lucu, dan hadiah virtual yang bisa kamu dapatkan saat menyelesaikan latihan soal!",
    },
    {
      question: "Apa yang harus aku persiapkan?",
      answer:
        "Cukup siapkan semangat belajar dan keinginan untuk jadi lebih pintar! SiapUjian akan membantu dengan latihan soal yang seru.",
    },
  ];

  const features = [
    {
      icon: "🏆",
      title: "Variasi Soal",
      description: "Soal yang berbeda tiap siswa nya",
    },
    {
      icon: "📊",
      title: "Lihat Kemajuanmu",
      description: "Pantau peningkatan nilai dan kemampuanmu setiap minggu",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Bersaing dengan Teman",
      description:
        "Lihat siapa yang mendapatkan nilai tertinggi di papan peringkat",
    },
  ];

  // Data pelajaran dengan warna-warna cerah
  const subjects = [
    { name: "Numerik", icon: "🔢", color: "bg-pink-400" },
    { name: "Literasi", icon: "📚", color: "bg-blue-400" },
    { name: "Karakter", icon: "🌍", color: "bg-purple-400" },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Header dengan balon animasi */}
      <div className="relative overflow-hidden">
        {/* Latar belakang dekoratif */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10">
          <div className="w-32 h-32 rounded-full bg-yellow-300 opacity-60"></div>
        </div>
        <div className="absolute bottom-0 left-10 -mb-10">
          <div className="w-24 h-24 rounded-full bg-blue-300 opacity-60"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce-slow">
          <div className="text-4xl">✏️</div>
        </div>
        <div className="absolute bottom-20 right-10 animate-spin-slow">
          <div className="text-4xl">📝</div>
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <div className="text-4xl">🎯</div>
        </div>

        {/* Konten utama */}
        <div
          className={`container mx-auto flex flex-col lg:flex-row justify-between items-center p-6 lg:p-10 transition-all duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0 transform translate-y-10"
          }`}
        >
          {/* Ilustrasi di sebelah kiri untuk desktop, di atas untuk mobile */}
          <div className="mt-4 lg:mt-0 lg:w-1/2 flex justify-center transition-all duration-500 hover:transform hover:scale-105">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-pink-200 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-green-200 animate-pulse"></div>
              <Image
                src="/icon/tentang-kami.svg"
                alt="guru icon"
                width={400}
                height={400}
                priority
                className="w-3/4 max-w-md lg:max-w-full relative z-10 drop-shadow-lg"
              />
            </div>
          </div>

          {/* Konten teks di sebelah kanan untuk desktop, di bawah untuk mobile */}
          <div className="flex flex-col lg:w-1/2 text-center lg:text-left md:mt-10 p-6 rounded-xl bg-white shadow-lg mt-8 lg:mt-0 border-2 border-blue-200">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm font-bold">
                TENTANG KAMI
              </div>
              <div className="ml-2 text-yellow-500 text-2xl">✨</div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
              Siap Ujian, Siap Pujian!
            </h1>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Halo teman-teman SDN 1 Cijoho! 👋
              </p>

              <p className="text-lg leading-relaxed">
                Selamat datang di{" "}
                <span className="font-bold text-blue-500">SiapUjian</span>,
                tempat belajar seru yang dibuat khusus untuk kalian! Di sini,
                kita bisa berlatih ANBK dengan cara yang menyenangkan dan
                interaktif.
              </p>

              <p className="text-lg leading-relaxed">
                Kami percaya setiap teman-teman punya kemampuan hebat, dan
                SiapUjian hadir untuk membantu kalian bersinar! ⭐
              </p>

              <div className="mt-6 flex justify-center lg:justify-start">
                <Link href={"/"}>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 flex items-center">
                    Mulai Latihan
                    <span className="ml-2 text-xl">🚀</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Fitur */}
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-600">
            Apa yang Kamu Dapatkan? 🎁
          </h2>
          <p className="mt-2 text-gray-600">
            Berbagai fitur seru untuk membantu latihanmu!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian Mata Pelajaran */}
      <div className="bg-blue-50 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-600">
              Mata Pelajaran 📚
            </h2>
            <p className="mt-2 text-gray-600">
              Latihan untuk semua pelajaran yang kamu perlukan
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className={`${subject.color} p-4 rounded-xl shadow-md w-64 text-center text-white transform transition-transform hover:scale-110 cursor-pointer`}
              >
                <div className="text-4xl mb-2">{subject.icon}</div>
                <h3 className="text-xl font-bold">{subject.name}</h3>
                <p className="mt-2 text-sm">30 soal latihan</p>
                <button className="mt-4 bg-white text-blue-600 rounded-full px-4 py-2 font-bold text-sm hover:bg-blue-100 transition">
                  Coba Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-blue-50 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-600">
              Pertanyaan yang Sering Ditanyakan 🤔
            </h2>
            <p className="mt-2 text-gray-600">
              Hal-hal yang ingin teman-teman ketahui
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="mb-4 bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  className="w-full p-4 text-left font-bold text-blue-600 flex justify-between items-center hover:bg-blue-50 transition"
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <span className="text-xl">
                    {activeFaq === index ? "📖" : "📘"}
                  </span>
                </button>
                <div
                  className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    activeFaq === index ? "max-h-40 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dekorasi bawah halaman */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
