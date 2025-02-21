"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const SoalForm = () => {
  const [textSoal, setTextSoal] = useState("");
  const [tipeSoal, setTipeSoal] = useState("pilihan_ganda");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [jawabanBenar, setJawabanBenar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangeOption = (e) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Pastikan id tersedia
    if (!id) {
      setError("ID latihan tidak ditemukan.");
      return;
    }

    // Validasi untuk tipe soal pilihan ganda
    if (
      tipeSoal === "pilihan_ganda" &&
      !["A", "B", "C", "D"].includes(jawabanBenar)
    ) {
      setError("Jawaban benar harus salah satu dari A, B, C, atau D.");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      latihan_id: id,
      text_soal: textSoal,
      tipe_soal: tipeSoal,
      options: tipeSoal === "pilihan_ganda" ? JSON.stringify(options) : "",
      jawaban_benar: jawabanBenar,
    };

    try {
      // Gunakan variabel lingkungan jika sudah disetting, fallback ke localhost
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.post(
        `${baseUrl}/api/latihan/${id}/soal/`,
        payload
      );
      console.log("Soal berhasil dibuat:", response.data);
      // Reset form setelah berhasil submit
      setTextSoal("");
      setTipeSoal("pilihan_ganda");
      setOptions({ A: "", B: "", C: "", D: "" });
      setJawabanBenar("");
    } catch (error) {
      console.error(
        "Gagal membuat soal:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message || "Terjadi kesalahan saat membuat soal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tambah Soal untuk Latihan {id}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Text Soal:</label>
        <input
          type="text"
          value={textSoal}
          onChange={(e) => setTextSoal(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tipe Soal:</label>
        <select value={tipeSoal} onChange={(e) => setTipeSoal(e.target.value)}>
          <option value="pilihan_ganda">Pilihan Ganda</option>
          <option value="essay">Essay</option>
          <option value="drag_drop">Drag & Drop</option>
        </select>
      </div>
      {tipeSoal === "pilihan_ganda" && (
        <>
          <div>
            <label>Option A:</label>
            <input
              type="text"
              name="A"
              value={options.A}
              onChange={handleChangeOption}
              required
            />
          </div>
          <div>
            <label>Option B:</label>
            <input
              type="text"
              name="B"
              value={options.B}
              onChange={handleChangeOption}
              required
            />
          </div>
          <div>
            <label>Option C:</label>
            <input
              type="text"
              name="C"
              value={options.C}
              onChange={handleChangeOption}
              required
            />
          </div>
          <div>
            <label>Option D:</label>
            <input
              type="text"
              name="D"
              value={options.D}
              onChange={handleChangeOption}
              required
            />
          </div>
          <div>
            <label>Jawaban Benar (A/B/C/D):</label>
            <input
              type="text"
              value={jawabanBenar}
              onChange={(e) => setJawabanBenar(e.target.value.toUpperCase())}
              placeholder="Masukkan huruf A/B/C/D"
              required
            />
          </div>
        </>
      )}
      <button type="submit" disabled={loading}>
        {loading ? "Sedang mengirim..." : "Tambah Soal"}
      </button>
    </form>
  );
};

export default SoalForm;
