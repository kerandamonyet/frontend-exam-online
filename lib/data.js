import axios from "axios";

// Guru
export const getGuru = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/guru?page=${page}&limit=${limit}`
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching data guru:", error);
    throw new Error("Gagal mengambil data guru.");
  }
};

export const updateGuru = async (id, updatedDataGuru) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/guru/${id}`,
      updatedDataGuru
    );
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error updating guru:", error);
    throw error;
  }
};

export const deleteGuru = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/guru/${id}`);
  return response;
};

// Siswa
export const getSiswa = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/siswa?page=${page}&limit=${limit}`
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching data siswa:", error);
    throw new Error("Gagal mengambil data siswa.");
  }
};

export const updatedSiswa = async (id, updatedDataSiswa) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/siswa/${id}`,
      updatedDataSiswa
    );
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error updating siswa:", error);
    throw error;
  }
};

export const deleteSiswa = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/siswa/${id}`);
  return response;
};

// Latihan
export const getLatihan = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/latihan?page=${page}&limit=${limit}`
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching data latihan:", error);
    throw new Error("Gagal mengambil data latihan.");
  }
};

export const getLatihanById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/latihan/${id}`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Data tidak valid");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching detail data latihan:", error);
    throw new Error("Gagal mengambil detail data latihan.");
  }
};

export const updatedLatihan = async (id_latihan, updatedDataLatihan) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/latihan/${id_latihan}`,
      updatedDataLatihan
    );

    if (!response.data.success || !response.data.data) {
      // Tambahkan detail data error ke pesan error
      throw new Error("Data tidak valid: " + JSON.stringify(response.data));
    }
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    // Coba tampilkan data error yang dikirim oleh server jika ada
    console.error(
      "Error updating latihan:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteLatihan = async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/api/latihan/${id}`
  );
  return response;
};

// Soal
export const getSoal = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/soal?page=${page}&limit=${limit}`
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching data soal:", error);
    throw new Error("Gagal mengambil data soal.");
  }
};

export const updatedSoal = async (id, updatedDataSoal) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/soal/${id}`,
      updatedDataSoal
    );
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error updating soal:", error);
    throw error;
  }
};

export const deleteSoal = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/soal/${id}`);
  return response;
};
