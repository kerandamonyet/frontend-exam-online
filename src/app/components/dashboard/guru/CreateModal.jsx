"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function CreateModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nama_guru: "",
    email: "",
    user_password: "",
    role_id: 1,
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [roleList, setRoleList] = useState([]); // Inisialisasi sebagai array kosong

  // mengambil data role id
  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5000/api/role")
        .then((res) => {
          console.log("Data dari API:", res.data); // Debugging
          setRoleList(Array.isArray(res.data) ? res.data : res.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching role:", err);
          setRoleList([]); // Hindari crash jika error
        });
    }
  }, [isOpen]);

  // Validasi Form
  const validate = () => {
    let newErrors = {};

    // Cek apakah nama guru kosong
    if (!formData.nama_guru.trim()) {
      newErrors.nama_guru = "Nama guru wajib diisi";
    }

    // Cek apakah email kosong
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Format email tidak valid";
    }

    // Cek apakah password kosong atau kurang dari 6 karakter
    if (!formData.user_password.trim()) {
      newErrors.user_password = "Password wajib diisi";
    } else if (formData.user_password.length < 6) {
      newErrors.user_password = "Password minimal 6 karakter";
    }

    // Cek apakah role_id kosong atau tidak valid
    if (!formData.role_id || formData.role_id <= 0) {
      newErrors.role_id = "Role ID wajib diisi dan harus lebih dari 0";
    }

    // Memperbarui state errors jika ada error
    setErrors(newErrors);

    // Mengembalikan true jika tidak ada error, false jika ada error
    return Object.keys(newErrors).length === 0;
  };

  // Cek jika email sudah terdaftar
  const checkEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/guru/check-email",
        { email: formData.email }
      );
      return response.data.message === "Email tersedia";
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error";
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: errorMessage,
      }));
      return false;
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Hanya menghapus error yang terkait dengan input yang sedang diubah
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form terlebih dahulu
    if (!validate()) return;

    // Cek email terlebih dahulu
    const isEmailAvailable = await checkEmail();
    if (!isEmailAvailable) return;

    setPending(true);

    try {
      const response = await axios.post("http://localhost:5000/api/guru", {
        nama_guru: formData.nama_guru,
        email: formData.email,
        user_password: formData.user_password,
        role_id: formData.role_id,
      });

      // Refresh data di parent, reset form, dan tutup modal
      onSubmit();
      // Jika berhasil, tampilkan success alert
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Guru berhasil ditambahkan!",
      });
      setFormData({ nama_guru: "", email: "", user_password: "", role_id: 1 });
      onClose();
    } catch (error) {
      // Jika error tidak terduga, tampilkan alert umum
      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan guru.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Tambah Guru</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nama Guru */}
          <div>
            <label className="block text-sm font-medium">Nama Guru</label>
            <input
              type="text"
              name="nama_guru"
              value={formData.nama_guru}
              onChange={handleChange}
              placeholder="Jhone Doe"
              required
              className={`w-full p-2 border rounded ${
                errors.nama_guru ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nama_guru && (
              <p className="text-red-500 text-sm mt-1">{errors.nama_guru}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="user_password"
              placeholder="*******"
              required
              value={formData.user_password}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.user_password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.user_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.user_password}
              </p>
            )}
          </div>

          {/* Role ID (Dropdown) */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.role_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Role</option>
              {roleList.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
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
