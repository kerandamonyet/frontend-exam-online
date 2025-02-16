"use client";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";

const MySwal = withReactContent(Swal);

function FormCreate({ onSubmit }) {
  // State untuk input teks/number (tanpa tanggal/waktu)
  const [formData, setFormData] = useState({
    kelas: "",
    tipe_latihan: "AKM", // default pilih AKM
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  // State untuk tanggal dan waktu menggunakan react-datepicker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
    if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
      newErrors.tgl_selesai =
        "Tanggal mulai dan tanggal selesai tidak boleh sama";
    }
    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      newErrors.tgl_selesai =
        "Tanggal selesai tidak boleh kurang dari tanggal mulai";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle perubahan pada input teks dan number
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Fungsi untuk memformat Date object menjadi string (YYYY-MM-DD HH:mm:ss)
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

      await axios.post("http://localhost:5000/api/latihan", {
        kelas: formData.kelas,
        tipe_latihan: formData.tipe_latihan,
        tgl_mulai: datetimeMulai,
        tgl_selesai: datetimeSelesai,
      });

      // Panggil callback refresh data dari parent
      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Latihan berhasil ditambahkan!",
      });

      // Reset form data dan datepicker ke nilai awal
      setFormData({
        kelas: "",
        tipe_latihan: "AKM",
        durasi: "",
      });
      setStartDate(new Date());
      setEndDate(new Date());
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan latihan.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 card border border-md shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Tambah Latihan</h3>
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
              defaultChecked
              id="radio-AKM"
              type="radio"
              value="AKM"
              name="tipe_latihan"
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
            <label className="block text-sm font-medium">Tanggal Selesai</label>
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
              <p className="text-red-500 text-sm mt-1">{errors.tgl_selesai}</p>
            )}
          </div>
        </div>

        {/* Tombol action */}
        <div className="flex justify-end space-x-2">
          <Link href="/dashboard/latihan">
            <button
              type="button"
              disabled={pending}
              className='px-4 py-2 text-white bg-gray-400 rounded'>
              Kembali
            </button>
          </Link>
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
  );
}

export default FormCreate;
