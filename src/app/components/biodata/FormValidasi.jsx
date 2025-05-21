"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AuthGuardSiswa from "../AuthGuardSiswa";
import BtnLogout from "./BtnLogout";

const MySwal = withReactContent(Swal);

function FormValidasi({ onSubmitSuccess }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ id_siswa: "", id_latihan: "" });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenJWT = Cookies.get("auth-token");

    if (!tokenJWT) {
      setLoading(false);
      return MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Token tidak ditemukan, silakan login kembali.",
      }).then(() => router.push("/login-siswa"));
    }

    try {
      const decoded = jwtDecode(tokenJWT);
      setFormData({
        id_siswa: decoded.id,
        nis: decoded.nis || "",
        id_latihan: "",
        nama_siswa: decoded.namaSiswa || "",
        jenis_kelamin: decoded.jenisKelamin || "",
        tgl_lahir: decoded.tglLahir
          ? new Date(decoded.tglLahir).toISOString().split("T")[0]
          : "",
      });
    } catch (err) {
      console.error("Token Error:", err);
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Token tidak valid, silakan login ulang.",
      }).then(() => router.push("/login-siswa"));
    } finally {
      setLoading(false);
    }
  }, [router]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.id_latihan.trim()) {
      newErrors.id_latihan = "Token wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.id_latihan]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/sesi-latihan",
        { id_siswa: formData.id_siswa, id_latihan: formData.id_latihan },
        { withCredentials: true }
      );

      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Konfirmasi Data Siswa berhasil!",
      }).then(() => onSubmitSuccess(formData.id_latihan)); // Kirim id_latihan

      setFormData((prev) => ({ ...prev, id_latihan: "" }));
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Memverifikasi token...</p>
      </div>
    );
  }

  return (
    <AuthGuardSiswa>
      <div className="max-w-screen-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Konfirmasi Data Peserta
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIS (Nomor Induk Siswa)
            </label>
            <input
              type="text"
              value={formData.nis}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Siswa
            </label>
            <input
              type="text"
              value={formData.nama_siswa}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Kelamin
            </label>
            <input
              type="text"
              value={formData.jenis_kelamin}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={formData.tgl_lahir}
              disabled
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ID Latihan
            </label>
            <input
              type="text"
              name="id_latihan"
              value={formData.id_latihan}
              onChange={handleChange}
              placeholder="Contoh: 420BA7CB"
              className={`w-full p-2 border ${
                errors.id_latihan ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.id_latihan && (
              <p className="text-red-500 text-sm">{errors.id_latihan}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {pending ? "Loading..." : "Mulai Latihan"}
            </button>
          </div>
        </form>
      </div>
    </AuthGuardSiswa>
  );
}

export default FormValidasi;
