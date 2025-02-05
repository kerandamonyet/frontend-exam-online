import axios from "axios";

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
