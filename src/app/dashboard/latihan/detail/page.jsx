import CardDetail from "@/app/components/dashboard/latihan/CardDetail";
import React from "react";

function DetailPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Latihan</h1>
        </header>

        {/* Content Area */}
        <section className="bg-white p-6 rounded shadow-lg">
          <h2 className="font-semibold">Detail Latihan</h2>
          {/* Tambahkan konten dashboard Anda di sini */}
          <div className="flex flex-1 mt-5 gap-2 justify-between">
            <CardDetail/>
            <CardDetail/>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DetailPage;
