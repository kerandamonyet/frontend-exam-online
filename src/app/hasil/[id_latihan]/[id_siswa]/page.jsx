import React from "react";
import { notFound } from "next/navigation";
import HasilSiswaClient from "./HasilSiswaClient";

async function getHasilSiswa(idLatihan, idSiswa) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/hasil/${idLatihan}/${idSiswa}`,
      { cache: "no-store" }
    );
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("Error fetching hasil:", error);
    return null;
  }
}

export default async function HasilSiswaPage({ params }) {
  const { id_latihan, id_siswa } = params;
  const hasil = await getHasilSiswa(id_latihan, id_siswa);

  if (!hasil?.success || hasil.error) notFound();

  return <HasilSiswaClient data={hasil.data} />;
}
