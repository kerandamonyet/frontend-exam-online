import React from "react";

function Card({ jumlahSiswa, jumlahGuru }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
      {/* Card untuk Jumlah Siswa */}
      <div className="mb-4 md:mb-0">
        <h3 className="text-sm font-medium text-gray-500">Jumlah Siswa</h3>
        <p className="text-3xl font-semibold text-gray-900">{jumlahSiswa}</p>
      </div>
      {/* Card untuk Jumlah Guru */}
      <div>
        <h3 className="text-sm font-medium text-gray-500">Jumlah Guru</h3>
        <p className="text-3xl font-semibold text-gray-900">{jumlahGuru}</p>
      </div>
    </div>
  );
}

export default Card;
