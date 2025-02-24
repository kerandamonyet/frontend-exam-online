import React from "react";
import BtnLogout from "./BtnLogout";

function InstruksiValidasi() {
  return (
    <section className="p-6 bg-white rounded-xl shadow-md">
      <header className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Instruksi Tata Cara Pengisian Data Form Validasi Peserta
        </h2>
      </header>
      <p className="text-sm text-gray-700 mb-4">
        Silakan ikuti langkah-langkah berikut untuk mengisi data form validasi
        peserta dengan benar:
      </p>
      <ol className="list-decimal list-inside space-y-4 text-sm text-gray-700 mb-2">
        <li>
          <span className="block font-bold text-gray-800 mb-1">Token:</span>
          <ul className="list-disc list-inside space-y-1">
            <li>Masukkan token unik yang telah diberikan oleh pihak guru.</li>
            <li>
              Token harus dimasukkan tanpa spasi dan sesuai dengan huruf
              besar/kecil yang diberikan.
            </li>
            <li>Jika mengalami kendala, hubungi admin atau panitia terkait.</li>
          </ul>
        </li>
      </ol>
      <BtnLogout />
    </section>
  );
}

export default InstruksiValidasi;
