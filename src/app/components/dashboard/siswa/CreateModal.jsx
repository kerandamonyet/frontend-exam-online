"use client";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Datepicker from "flowbite-datepicker"; // Pastikan paket sudah terinstal dan dikonfigurasi

const MySwal = withReactContent(Swal);

function CreateModal({ isOpen, onClose, onSubmit, siswa }) {
  if (!isOpen) return null;

  // Inisialisasi state dengan field yang relevan untuk siswa
  const [formData, setFormData] = useState({
    nama_siswa: "",
    kelas: "",
    jenis_kelamin: "",
    tgl_lahir: "",
    role_id: 1,
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  // Validasi Form
  const validate = () => {
    let newErrors = {};

    // Cek apakah nama siswa kosong
    if (!formData.nama_siswa.trim()) {
      newErrors.nama_siswa = "Nama siswa wajib diisi";
    }

    // Cek apakah kelas kosong
    if (!formData.kelas.trim()) {
      newErrors.kelas = "Kelas wajib diisi";
    }

    // Cek apakah jenis kelamin kosong
    if (!formData.jenis_kelamin.trim()) {
      newErrors.jenis_kelamin = "Jenis kelamin wajib diisi";
    }

    // Cek apakah tanggal lahir kosong
    if (!formData.tgl_lahir.trim()) {
      newErrors.tgl_lahir = "Tanggal lahir wajib diisi";
    }

    // Cek apakah role_id kosong atau tidak valid
    if (!formData.role_id || formData.role_id <= 0) {
      newErrors.role_id = "Role ID wajib diisi dan harus lebih dari 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error terkait field yang diubah
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    try {
      // Kirim data siswa ke API
      await axios.post("http://localhost:5000/api/siswa", {
        nama_siswa: formData.nama_siswa,
        kelas: formData.kelas,
        jenis_kelamin: formData.jenis_kelamin,
        tgl_lahir: formData.tgl_lahir,
        role_id: formData.role_id,
      });

      // Panggil callback refresh data dari parent
      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Siswa berhasil ditambahkan!",
      });
      // Reset form data
      setFormData({
        nama_siswa: "",
        kelas: "",
        jenis_kelamin: "",
        tgl_lahir: "",
        role_id: 1,
      });
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan siswa.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Tambah Siswa</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nama Siswa */}
          <div>
            <label className="block text-sm font-medium">Nama Siswa</label>
            <input
              type="text"
              name="nama_siswa"
              value={formData.nama_siswa}
              onChange={handleChange}
              placeholder="Jhone Doe"
              required
              className={`w-full p-2 border rounded ${
                errors.nama_siswa ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nama_siswa && (
              <p className="text-red-500 text-sm mt-1">{errors.nama_siswa}</p>
            )}
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-sm font-medium">Kelas</label>
            <input
              type="text"
              name="kelas"
              placeholder="A"
              required
              value={formData.kelas}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.kelas ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.kelas && (
              <p className="text-red-500 text-sm mt-1">{errors.kelas}</p>
            )}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium">Jenis Kelamin</label>
            <div className="flex items-center mb-4">
              <input
                id="radio-laki"
                type="radio"
                value="Laki-laki"
                name="jenis_kelamin"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="radio-laki"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Laki-laki
              </label>
            </div>
            <div className="flex items-center">
              <input
                defaultChecked
                id="radio-perempuan"
                type="radio"
                value="Perempuan"
                name="jenis_kelamin"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="radio-perempuan"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Perempuan
              </label>
            </div>
            {errors.jenis_kelamin && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenis_kelamin}
              </p>
            )}
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium">Tanggal Lahir</label>
            <div className="relative max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                id="datepicker-format"
                data-datepicker
                data-datepicker-format="dd-mm-yyyy"
                type="text"
                name="tgl_lahir"
                value={formData.tgl_lahir}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="dd-mm-yyyy"
              />
            </div>
            {errors.tgl_lahir && (
              <p className="text-red-500 text-sm mt-1">{errors.tgl_lahir}</p>
            )}
          </div>

          {/* Role ID */}
          <div>
            <label className="block text-sm font-medium">Role ID</label>
            <input
              type="number"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              placeholder="1"
              required
              className={`w-full p-2 border rounded ${
                errors.role_id ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.role_id && (
              <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
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

export default CreateModal;
