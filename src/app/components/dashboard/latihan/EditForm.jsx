"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updatedLatihan } from "../../../../../lib/data";

const MySwal = withReactContent(Swal);

function EditModal({ isOpen, onClose, onSubmit, latihan }) {
  if (!isOpen) return null;

  // State untuk input teks/number
  const [formData, setFormData] = useState({
    kelas: "",
    tipe_latihan: "AKM", // default pilih AKM
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  // State untuk tanggal dan waktu menggunakan react-datepicker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Muat data awal (jika ada) dari prop "latihan"
  useEffect(() => {
    if (latihan) {
      setFormData({
        kelas: latihan.kelas || "",
        tipe_latihan: latihan.tipe_latihan || "AKM",
      });
      // Pastikan latihan.tgl_mulai dan latihan.tgl_selesai merupakan string tanggal yang valid
      setStartDate(new Date(latihan.tgl_mulai));
      setEndDate(new Date(latihan.tgl_selesai));
    }
  }, [latihan]);

  // Validasi Form
  const validate = () => {
    let newErrors = {};

    if (!formData.kelas.trim()) {
      newErrors.kelas = "Kelas wajib diisi";
    }
    if (!formData.tipe_latihan.trim()) {
      newErrors.tipe_latihan = "Tipe Latihan wajib diisi";
    }
    if (!startDate) {
      newErrors.tgl_mulai = "Tanggal mulai wajib diisi";
    }
    if (!endDate) {
      newErrors.tgl_selesai = "Tanggal selesai wajib diisi";
    }
    // Validasi: endDate tidak boleh kurang dari startDate
    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      newErrors.tgl_selesai =
        "Tanggal selesai tidak boleh kurang dari tanggal mulai";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle perubahan input teks/number
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fungsi untuk memformat objek Date menjadi string (YYYY-MM-DD HH:mm:ss)
  const formatDateTime = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    try {
      const datetimeMulai = formatDateTime(startDate);
      const datetimeSelesai = formatDateTime(endDate);

      // Panggil fungsi updatedLatihan dengan ID dari latihan.id dan data update
      await updatedLatihan(latihan.id_latihan, {
        kelas: formData.kelas,
        tipe_latihan: formData.tipe_latihan,
        tgl_mulai: datetimeMulai,
        tgl_selesai: datetimeSelesai,
      });

      onSubmit(); // Refresh data dari parent
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Latihan berhasil diperbarui!",
      });

      // Tutup modal setelah sukses (opsional)
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui latihan.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Edit Latihan</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Kelas */}
          <div>
            <label className="block text-sm font-medium">Kelas</label>
            <input
              type="text"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              placeholder="A"
              required
              className={`w-full p-2 border rounded ${
                errors.kelas ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.kelas && (
              <p className="text-red-500 text-sm mt-1">{errors.kelas}</p>
            )}
          </div>

          {/* Input Tipe Latihan */}
          <div>
            <label className="block text-sm font-medium">Tipe Latihan</label>
            <div className="flex items-center mb-2">
              <input
                id="radio-AKM"
                type="radio"
                value="AKM"
                name="tipe_latihan"
                checked={formData.tipe_latihan === "AKM"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="radio-AKM"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                AKM
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                id="radio-SLB"
                type="radio"
                value="SLB"
                name="tipe_latihan"
                checked={formData.tipe_latihan === "SLB"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="radio-SLB"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                SLB
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                id="radio-Literasi-Numerik"
                type="radio"
                value="Literasi Numerik"
                name="tipe_latihan"
                checked={formData.tipe_latihan === "Literasi Numerik"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="radio-Literasi-Numerik"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Literasi Numerik
              </label>
            </div>
            {errors.tipe_latihan && (
              <p className="text-red-500 text-sm mt-1">{errors.tipe_latihan}</p>
            )}
          </div>

          {/* Input Tanggal Mulai dan Tanggal Selesai */}
          <div className="flex flex-1 gap-3">
            <div>
              <label className="block text-sm font-medium">Tanggal Mulai</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd-MM-yyyy HH:mm:ss"
                className="w-full p-2 border rounded"
              />
              {errors.tgl_mulai && (
                <p className="text-red-500 text-sm mt-1">{errors.tgl_mulai}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Tanggal Selesai
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd-MM-yyyy HH:mm:ss"
                className="w-full p-2 border rounded"
              />
              {errors.tgl_selesai && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tgl_selesai}
                </p>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              disabled={pending}
              className={`px-4 py-2 text-white rounded ${
                pending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {pending ? "Loading..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
