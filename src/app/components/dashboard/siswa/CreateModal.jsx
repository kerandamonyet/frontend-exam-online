"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function CreateModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nis: "",
    nama_siswa: "",
    jenis_kelamin: "",
    tgl_lahir: "",
    kelas_id: "",
  });

  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [kelasList, setKelasList] = useState([]); // Inisialisasi sebagai array kosong
  const [roleList, setRoleList] = useState([]); // Inisialisasi sebagai array kosong

  // Ambil daftar kelas dari database saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5000/api/kelas")
        .then((res) => {
          console.log("Data dari API:", res.data); // Debugging
          setKelasList(
            Array.isArray(res.data) ? res.data : res.data.data || []
          );
        })
        .catch((err) => {
          console.error("Error fetching kelas:", err);
          setKelasList([]); // Hindari crash jika error
        });
    }
  }, [isOpen]);

  // useEffect(() => {
  //   if (isOpen) {
  //     axios
  //       .get("http://localhost:5000/api/role")
  //       .then((res) => {
  //         console.log("Data dari API:", res.data); // Debugging
  //         setRoleList(Array.isArray(res.data) ? res.data : res.data.data || []);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching role:", err);
  //         setRoleList([]); // Hindari crash jika error
  //       });
  //   }
  // }, [isOpen]);

  // Validasi Form
  const validate = () => {
    let newErrors = {};
    if (!formData.nis.trim()) {
      newErrors.nis = "NIS wajib diisi";
    }
    if (!formData.nama_siswa.trim()) {
      newErrors.nama_siswa = "Nama siswa wajib diisi";
    }
    if (!formData.kelas_id.trim()) {
      newErrors.kelas_id = "Kelas ID wajib diisi";
    }
    if (!formData.jenis_kelamin.trim()) {
      newErrors.jenis_kelamin = "Jenis kelamin wajib diisi";
    }
    if (!formData.tgl_lahir.trim()) {
      newErrors.tgl_lahir = "Tanggal lahir wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPending(true);

    try {
      await axios.post("http://localhost:5000/api/siswa", {
        nis: formData.nis,
        nama_siswa: formData.nama_siswa,
        jenis_kelamin: formData.jenis_kelamin,
        tgl_lahir: formData.tgl_lahir,
        kelas_id: formData.kelas_id,
      });

      onSubmit();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Siswa berhasil ditambahkan!",
      });

      setFormData({
        nis: "",
        nama_siswa: "",
        jenis_kelamin: "",
        tgl_lahir: "",
        kelas_id: "",
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
          {/* NIS */}
          <div>
            <label className="block text-sm font-medium">
              Nomor Induk Siswa
            </label>
            <input
              type="number"
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              placeholder="20210810103"
              required
              className={`w-full p-2 border rounded ${
                errors.nis ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nis && (
              <p className="text-red-500 text-sm mt-1">{errors.nis}</p>
            )}
          </div>
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

          {/* Kelas ID (Dropdown) */}
          <div>
            <label className="block text-sm font-medium">Kelas</label>
            <select
              name="kelas_id"
              value={formData.kelas_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.kelas_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Kelas</option>
              {kelasList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </option>
              ))}
            </select>
            {errors.kelas_id && (
              <p className="text-red-500 text-sm mt-1">{errors.kelas_id}</p>
            )}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium">Jenis Kelamin</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Laki-laki"
                  name="jenis_kelamin"
                  onChange={handleChange}
                  className="mr-2"
                />
                Laki-laki
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Perempuan"
                  name="jenis_kelamin"
                  onChange={handleChange}
                  className="mr-2"
                />
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
            <input
              type="date"
              name="tgl_lahir"
              value={formData.tgl_lahir}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded border-gray-300"
            />
            {errors.tgl_lahir && (
              <p className="text-red-500 text-sm mt-1">{errors.tgl_lahir}</p>
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
