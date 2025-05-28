"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { updatedSoal } from "../../../../../lib/data";

const MySwal = withReactContent(Swal);
const API_BASE_URL = "http://localhost:5000/api";

function EditForm({ onSubmit, id, initialData }) {
  // Main form state
  const [formData, setFormData] = useState({
    latihan_id: "",
    text_soal: "",
    tipe_soal: "pilihan_ganda",
  });

  // Multiple choice specific state
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Tarik garis (line matching) specific state
  const [leftOptions, setLeftOptions] = useState(["", ""]);
  const [rightOptions, setRightOptions] = useState(["", ""]);
  const [matchingPairs, setMatchingPairs] = useState({});

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

  // Set initial data
  useEffect(() => {
    if (initialData && quill) {
      setFormData({
        latihan_id: initialData.latihan_id || "",
        text_soal: initialData.text_soal || "",
        tipe_soal: initialData.tipe_soal || "pilihan_ganda",
      });

      // Handle different question types
      if (initialData.tipe_soal === "pilihan_ganda") {
        setOptions([
          initialData.opsi_a || "",
          initialData.opsi_b || "",
          initialData.opsi_c || "",
          initialData.opsi_d || "",
        ]);
        setCorrectAnswer(initialData.jawaban_benar || "");
      } else if (
        initialData.tipe_soal === "tarik_garis" &&
        initialData.data_tarik_garis
      ) {
        const {
          opsi_kiri = [],
          opsi_kanan = [],
          jawaban_benar = {},
        } = initialData.data_tarik_garis;

        // Ensure we have at least two options
        const leftOpts = [...opsi_kiri];
        const rightOpts = [...opsi_kanan];

        while (leftOpts.length < 2) leftOpts.push("");
        while (rightOpts.length < 2) rightOpts.push("");

        setLeftOptions(leftOpts);
        setRightOptions(rightOpts);
        setMatchingPairs(jawaban_benar);
      }

      // Set Quill content
      quill.clipboard.dangerouslyPasteHTML(initialData.text_soal || "");
    }
  }, [initialData, quill]);

  // Handle Quill content changes
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        // Get plain text for validation
        const plainText = quill.getText().trim();
        setFormData((prev) => ({
          ...prev,
          text_soal: plainText ? content : "",
        }));

        // Clear error if there's content
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
    } else if (formData.tipe_soal === "tarik_garis") {
      if (leftOptions.some((opt) => !opt.trim())) {
        newErrors.leftOptions = "Semua opsi kiri harus diisi";
      }

      if (rightOptions.some((opt) => !opt.trim())) {
        newErrors.rightOptions = "Semua opsi kanan harus diisi";
      }

      // Check if all left options have a matching right option
      const allLeftOptionsMatched = leftOptions.every(
        (opt) => opt.trim() && matchingPairs[opt]
      );

      if (!allLeftOptionsMatched) {
        newErrors.matchingPairs =
          "Semua opsi kiri harus dipasangkan dengan opsi kanan";
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

  // Handle left option changes for tarik garis
  const handleLeftOptionChange = (index, value) => {
    const newLeftOptions = [...leftOptions];
    const oldValue = newLeftOptions[index];
    newLeftOptions[index] = value;
    setLeftOptions(newLeftOptions);

    // Update the matchingPairs object if this left option had a match
    if (oldValue && matchingPairs[oldValue]) {
      const newPairs = { ...matchingPairs };
      delete newPairs[oldValue];
      if (value) {
        newPairs[value] = matchingPairs[oldValue];
      }
      setMatchingPairs(newPairs);
    }

    setErrors((prev) => ({ ...prev, leftOptions: "" }));
  };

  // Handle right option changes for tarik garis
  const handleRightOptionChange = (index, value) => {
    const newRightOptions = [...rightOptions];
    const oldValue = newRightOptions[index];
    newRightOptions[index] = value;
    setRightOptions(newRightOptions);

    // Update matches referencing this right option
    if (oldValue) {
      const newPairs = { ...matchingPairs };
      for (const [left, right] of Object.entries(newPairs)) {
        if (right === oldValue && value) {
          newPairs[left] = value;
        }
      }
      setMatchingPairs(newPairs);
    }

    setErrors((prev) => ({ ...prev, rightOptions: "" }));
  };

  // Handle match pair selection for tarik garis
  const handleMatchPairChange = (leftOption, rightOption) => {
    setMatchingPairs((prev) => ({
      ...prev,
      [leftOption]: rightOption,
    }));
    setErrors((prev) => ({ ...prev, matchingPairs: "" }));
  };

  // Add new row to tarik garis options
  const addTarikGarisRow = () => {
    setLeftOptions((prev) => [...prev, ""]);
    setRightOptions((prev) => [...prev, ""]);
  };

  // Remove row from tarik garis options
  const removeTarikGarisRow = (index) => {
    if (leftOptions.length <= 2) {
      MySwal.fire({
        icon: "warning",
        title: "Tidak dapat menghapus",
        text: "Minimal harus ada 2 pasangan untuk soal tarik garis",
      });
      return;
    }

    const newLeftOptions = [...leftOptions];
    const newRightOptions = [...rightOptions];

    // Remove the leftOption from matchingPairs if it exists
    const removedLeftOption = newLeftOptions[index];
    const newPairs = { ...matchingPairs };
    if (removedLeftOption) {
      delete newPairs[removedLeftOption];
    }

    newLeftOptions.splice(index, 1);
    newRightOptions.splice(index, 1);

    setLeftOptions(newLeftOptions);
    setRightOptions(newRightOptions);
    setMatchingPairs(newPairs);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setPending(true);

    try {
      let updateData;

      if (formData.tipe_soal === "pilihan_ganda") {
        updateData = {
          latihan_id: formData.latihan_id,
          text_soal: formData.text_soal,
          tipe_soal: formData.tipe_soal,
          opsi_a: options[0],
          opsi_b: options[1],
          opsi_c: options[2],
          opsi_d: options[3],
          jawaban_benar: correctAnswer,
        };
      } else if (formData.tipe_soal === "tarik_garis") {
        // Filter out empty options
        const filteredLeftOptions = leftOptions.filter((opt) => opt.trim());
        const filteredRightOptions = rightOptions.filter((opt) => opt.trim());

        // Create jawaban_benar object from matchingPairs
        const jawaban_benar = {};
        filteredLeftOptions.forEach((leftOpt) => {
          if (matchingPairs[leftOpt]) {
            jawaban_benar[leftOpt] = matchingPairs[leftOpt];
          }
        });

        updateData = {
          latihan_id: formData.latihan_id,
          text_soal: formData.text_soal,
          tipe_soal: formData.tipe_soal,
          data_tarik_garis: {
            opsi_kiri: filteredLeftOptions,
            opsi_kanan: filteredRightOptions,
            jawaban_benar: jawaban_benar,
          },
        };
      } else if (formData.tipe_soal === "drag_drop") {
        updateData = {
          latihan_id: formData.latihan_id,
          text_soal: formData.text_soal,
          tipe_soal: formData.tipe_soal,
          items: dragDropItems,
        };
      }

      console.log("Updating data:", updateData);
      await updatedSoal(id, updateData);

      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Soal berhasil diperbarui!",
      });

      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error("Error updating question:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat memperbarui soal.";

      MySwal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMessage,
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 card border border-md shadow-lg bg-white rounded-lg">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Edit Soal
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
                formData.tipe_soal === "tarik_garis"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                id="radio-tarik-garis"
                type="radio"
                value="tarik_garis"
                name="tipe_soal"
                checked={formData.tipe_soal === "tarik_garis"}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="radio-tarik-garis"
                className="ml-2 text-sm font-medium text-gray-900 w-full cursor-pointer"
              >
                Tarik Garis
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

        {/* Tarik Garis Interface */}
        {formData.tipe_soal === "tarik_garis" && (
          <div className="form-group">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Pasangan Tarik Garis <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addTarikGarisRow}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                + Tambah Pasangan
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2 px-2 pb-2 font-medium text-sm">
                <div className="col-span-2">Opsi Kiri</div>
                <div className="col-span-2">Opsi Kanan</div>
                <div></div>
              </div>

              {leftOptions.map((leftOption, index) => (
                <div key={index} className="grid grid-cols-5 gap-2">
                  <input
                    type="text"
                    value={leftOption}
                    onChange={(e) =>
                      handleLeftOptionChange(index, e.target.value)
                    }
                    placeholder="Isi opsi kiri"
                    className="col-span-2 border p-2 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                  />

                  <select
                    value={matchingPairs[leftOption] || ""}
                    onChange={(e) =>
                      handleMatchPairChange(leftOption, e.target.value)
                    }
                    className="col-span-2 border p-2 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                    disabled={!leftOption}
                  >
                    <option value="">Pilih Pasangan</option>
                    {rightOptions.map(
                      (rightOption, idx) =>
                        rightOption && (
                          <option key={idx} value={rightOption}>
                            {rightOption}
                          </option>
                        )
                    )}
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rightOptions[index]}
                      onChange={(e) =>
                        handleRightOptionChange(index, e.target.value)
                      }
                      placeholder="Isi opsi kanan"
                      className="border p-2 rounded-md w-full focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeTarikGarisRow(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {errors.leftOptions && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.leftOptions}
                </p>
              )}
              {errors.rightOptions && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.rightOptions}
                </p>
              )}
              {errors.matchingPairs && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.matchingPairs}
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

export default EditForm;
