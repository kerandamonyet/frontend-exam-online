import React from "react";
import BtnLogout from "./BtnLogout";

function InstruksiValidasi() {
  return (
    <section className="p-6 bg-blue-50 rounded-xl shadow-md">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center">
          <span className="mr-2">🚀</span> Yuk, Isi Form dengan Mudah!
        </h2>
      </header>
      <p className="text-base text-blue-800 mb-4">
        Ikuti langkah-langkah seru di bawah ini, ya:
      </p>
      <ol className="list-decimal list-inside space-y-4 text-base text-blue-800 mb-4">
        <li>
          <span className="block font-bold mb-1">ID Latihan Rahasia:</span>
          <ul className="list-disc list-inside space-y-1">
            <li>Masukkan kode rahasia yang diberikan gurumu.</li>
            <li>
              Pastikan menulisnya dengan benar, tanpa spasi dan sesuai hurufnya.
            </li>
            <li>Jika ada yang bingung, tanya gurumu atau admin.</li>
          </ul>
        </li>
      </ol>
      <BtnLogout />
    </section>
  );
}

export default InstruksiValidasi;
