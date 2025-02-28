"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const MySwal = withReactContent(Swal);
const API_BASE_URL = "http://localhost:5000/api";

function FormCreate({ onSubmit }) {
  // Main form state
  const [formData, setFormData] = useState({
    latihan_id: "",
    text_soal: "",
    tipe_soal: "pilihan_ganda",
  });

  // Multiple choice specific state
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Drag and drop specific state (if needed in the future)
  const [dragDropItems, setDragDropItems] = useState([]);

  // UI state
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [latihanList, setLatihanList] = useState([]);

  // Rich text editor setup
  const { quill, quillRef } = useQuill({
    placeholder: "Tulis soal di sini...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "code-block"],
      ],
    },
  });

  // Handle Quill content changes
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        // Dapatkan teks polos untuk validasi
        const plainText = quill.getText().trim();
        setFormData((prev) => ({
          ...prev,
          text_soal: plainText ? content : "",
        }));

        // Clear error jika ada konten
        if (plainText) {
          setErrors((prev) => ({ ...prev, text_soal: "" }));
        }
      });
    }
  }, [quill]);

  // Fetch list of exercises
  useEffect(() => {
    const fetchLatihanList = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/latihan`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setLatihanList(data);
      } catch (err) {
        console.error("Error fetching latihan:", err);
        MySwal.fire({
          icon: "error",
          title: "Gagal memuat data latihan",
          text: "Silakan coba lagi nanti atau hubungi administrator",
        });
        setLatihanList([]);
      }
    };

    fetchLatihanList();
  }, []);

  // Form validation
  const validate = () => {
    let newErrors = {};

    if (!formData.latihan_id.trim()) {
      newErrors.latihan_id = "Latihan wajib diisi";
    }

    if (!formData.text_soal || formData.text_soal === "<p><br></p>") {
      newErrors.text_soal = "Soal wajib diisi";
    }

    if (formData.tipe_soal === "pilihan_ganda") {
      if (options.some((opt) => !opt.trim())) {
        newErrors.options = "Semua opsi harus diisi";
      }

      if (!correctAnswer) {
        newErrors.correctAnswer = "Jawaban benar wajib dipilih";
      }
    } else if (formData.tipe_soal === "drag_drop") {
      if (dragDropItems.length === 0) {
        newErrors.dragDropItems =
          "Minimal satu item drag & drop harus ditambahkan";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle option changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setErrors((prev) => ({ ...prev, options: "" }));
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (value) => {
    setCorrectAnswer(value);
    setErrors((prev) => ({ ...prev, correctAnswer: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setPending(true);

    try {
      let requestBody;

      if (formData.tipe_soal === "pilihan_ganda") {
        requestBody = {
          latihan_id: formData.latihan_id,
          text_soal: formData.text_soal,
          tipe_soal: formData.tipe_soal,
          opsi_a: options[0],
          opsi_b: options[1],
          opsi_c: options[2],
          opsi_d: options[3],
          jawaban_benar: correctAnswer,
        };
      } else if (formData.tipe_soal === "drag_drop") {
        requestBody = {
          latihan_id: formData.latihan_id,
          text_soal: formData.text_soal,
          tipe_soal: formData.tipe_soal,
          items: dragDropItems,
        };
      }

      // Debug: tampilkan data yang akan dikirim
      console.log("Request body:", requestBody);

      await axios.post(`${API_BASE_URL}/latihan/soal`, requestBody);

      if (onSubmit) {
        onSubmit();
      }

      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Soal berhasil ditambahkan!",
      });

      resetForm();
    } catch (error) {
      console.error("Error submitting question:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat menambahkan soal.";

      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMessage,
      });
    } finally {
      setPending(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      latihan_id: "",
      text_soal: "",
      tipe_soal: "pilihan_ganda",
    });
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setDragDropItems([]);
    if (quill) {
      quill.setContents([]);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 card border border-md shadow-lg bg-white rounded-lg">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Tambah Soal
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Latihan */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Nama Latihan <span className="text-red-500">*</span>
          </label>
          <select
            name="latihan_id"
            value={formData.latihan_id}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none transition ${
              errors.latihan_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Pilih Latihan</option>
            {latihanList.map((latihan) => (
              <option key={latihan.id_latihan} value={latihan.id_latihan}>
                {latihan.nama_latihan}
              </option>
            ))}
          </select>
          {errors.latihan_id && (
            <p className="text-red-500 text-sm mt-1">{errors.latihan_id}</p>
          )}
        </div>
        {/* Tipe Soal */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Tipe Soal
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`flex items-center p-3 border rounded-md ${
                formData.tipe_soal === "pilihan_ganda"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                id="radio-pg"
                type="radio"
                value="pilihan_ganda"
                name="tipe_soal"
                checked={formData.tipe_soal === "pilihan_ganda"}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="radio-pg"
                className="ml-2 text-sm font-medium text-gray-900 w-full cursor-pointer"
              >
                Pilihan Ganda
              </label>
            </div>
            <div
              className={`flex items-center p-3 border rounded-md ${
                formData.tipe_soal === "drag_drop"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                id="radio-drag-drop"
                type="radio"
                value="drag_drop"
                name="tipe_soal"
                checked={formData.tipe_soal === "drag_drop"}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="radio-drag-drop"
                className="ml-2 text-sm font-medium text-gray-900 w-full cursor-pointer"
              >
                Drag and Drop
              </label>
            </div>
          </div>
        </div>
        {/* Soal menggunakan Quill */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Soal <span className="text-red-500">*</span>
          </label>
          <div
            className={`bg-white border ${
              errors.text_soal ? "border-red-500" : "border-gray-300"
            } rounded-md mb-2 min-h-[150px]`}
          >
            <div ref={quillRef} className="h-[150px]" />
          </div>
          {errors.text_soal && (
            <p className="text-red-500 text-sm mt-1">{errors.text_soal}</p>
          )}
        </div>
        {/* Multiple Choice Options */}
        {formData.tipe_soal === "pilihan_ganda" && (
          <div className="form-group">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Opsi Pilihan Ganda <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {["a", "b", "c", "d"].map((option, index) => (
                <div
                  key={option}
                  className={`flex items-center gap-2 p-3 border rounded-md ${
                    correctAnswer === option
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={option}
                    checked={correctAnswer === option}
                    onChange={() => handleCorrectAnswerChange(option)}
                    className="h-6 w-6 accent-blue-600 focus:ring-2 focus:ring-black"
                  />
                  <span className="text-sm font-medium min-w-[80px]">
                    Pilihan {option.toUpperCase()}:
                  </span>
                  <input
                    type="text"
                    value={options[index]}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Isi opsi ${option.toUpperCase()}`}
                    className="border p-2 rounded-md flex-1 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>
              ))}
              {errors.options && (
                <p className="text-red-500 text-sm mt-1">{errors.options}</p>
              )}
              {errors.correctAnswer && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.correctAnswer}
                </p>
              )}
            </div>
          </div>
        )}
        {/* Drag and Drop Interface - Placeholder */}
        {formData.tipe_soal === "drag_drop" && (
          <div className="form-group bg-gray-50 p-4 rounded-md border border-gray-300">
            <div className="text-center p-5">
              <p className="text-gray-500">
                Fitur Drag and Drop belum tersedia saat ini.
                <br />
                Silakan gunakan tipe Pilihan Ganda.
              </p>
              {errors.dragDropItems && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dragDropItems}
                </p>
              )}
            </div>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link href="/dashboard/soal">
            <button
              type="button"
              disabled={pending}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
            >
              Kembali
            </button>
          </Link>
          <button
            type="submit"
            disabled={pending}
            className={`px-5 py-2.5 text-white rounded-md transition ${
              pending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {pending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCreate;
