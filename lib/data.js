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
