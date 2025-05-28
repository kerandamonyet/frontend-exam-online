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

// Role
export const getRole = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/role`);

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching data role:", error);
    throw new Error("Gagal mengambil data role.");
  }
};

export const updatedRole = async (id, updatedDataRole) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/role/${id}`,
      updatedDataRole
    );
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/role/${id}`);
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
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/siswa/${id}`
    );
    return response;
  } catch (error) {
    // Cek apakah error berasal dari axios
    if (axios.isAxiosError(error)) {
      console.error(
        "Gagal menghapus siswa:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Gagal menghapus siswa. Silakan coba lagi."
      );
    } else {
      console.error("Error tidak diketahui:", error);
      throw new Error("Terjadi kesalahan yang tidak diketahui.");
    }
  }
};

// Kelas
export const getKelas = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/kelas?page=${page}&limit=${limit}`
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching data kelas:", error);
    throw new Error("Gagal mengambil data kelas.");
  }
};

export const updatedKelas = async (id, updatedDataKelas) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/kelas/${id}`,
      updatedDataKelas
    );
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error updating kelas:", error);
    throw error;
  }
};

export const deleteKelas = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/kelas/${id}`);
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
    const response = await axios.get(`http://localhost:5000/api/latihan/${id}`);
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
export const getAllSoal = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/latihan/soal?page=${page}&limit=${limit}`
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

export async function getSoalByIdSoal(id) {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/latihan/soal/${id}`
    );

    // Pastikan response sukses dan data soal ada
    if (!response.data.success || !response.data.data) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
      pagination: response.data.pagination, // biasanya null untuk single data
    };
  } catch (error) {
    console.error("Error fetching data soal by id:", error);
    throw new Error("Gagal mengambil data soal berdasarkan id.");
  }
}

export const getSoalByLatihanId = async (latihanId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/latihan/${latihanId}/soal?page=${page}&limit=${limit}`
    );

    // Pastikan response sukses dan data soal berbentuk array
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Data tidak valid");
    }

    return {
      data: response.data.data,
      pagination: response.data.pagination, // berdasarkan response, pagination bernilai null
    };
  } catch (error) {
    console.error("Error fetching data soal by latihan id:", error);
    throw new Error("Gagal mengambil data soal berdasarkan id latihan.");
  }
};

export const updatedSoal = async (id, updatedDataSoal) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/latihan/soal/${id}`,
      updatedDataSoal
    );

    // Pastikan respons sukses berdasarkan HTTP status dan flag success dari API
    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message || "Gagal memperbarui soal");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating soal:", error.message);
    throw new Error("Terjadi kesalahan saat memperbarui soal");
  }
};

export const deleteSoal = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/latihan/soal/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting soal:", error.message);
    throw new Error("Terjadi kesalahan saat menghapus soal");
  }
};

// Sesi Latihan
export const getAllSesiLatihan = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/sesi-latihan/?page=${page}&limit=${limit}`
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
export const deleteSesiLatihan = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/sesi-latihan/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting soal:", error.message);
    throw new Error("Terjadi kesalahan saat menghapus soal");
  }
};

// Hasil Akhir Siswa
export const getAllHasilSiswa = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/hasil?page=${page}&limit=${limit}`
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

export const getHasilByLatihan = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/hasil/latihan/${id}`
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
