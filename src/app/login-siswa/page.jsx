"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const LoginFormSiswa = () => {
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [pending, setPending] = useState(false);

  // Validasi form
  const validateForm = () => {
    let valid = true;
    let newErrors = { username: "", password: "" };

    if (!username) {
      newErrors.username = "Username tidak boleh kosong.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password tidak boleh kosong.";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password harus 8 karakter.";
      valid = false;
    } else if (password.length > 8) {
      newErrors.password = "Password tidak boleh lebih dari 8 karakter.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      MySwal.fire({
        icon: "error",
        title: "Form login Tidak Lengkap!",
        text: "Silahkan lengkapi field yang diperlukan.",
      });
    }

    return valid;
  };

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setPending(true);
    console.log("🔄 [LOGIN] Mengirim data:", { username, password });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/siswa/login",
        {
          username,
          password,
        }
      );

      console.log("✅ [LOGIN] Token diterima:", response.data.token);

      Cookies.set("auth-token", response.data.token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Login berhasil!",
      });

      router.push("/biodata");
    } catch (error) {
      console.error("❌ [LOGIN] Error:", error.response?.data || error.message);
      MySwal.fire({
        icon: "error",
        title: "Login Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan, coba lagi nanti.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h5 className="text-xl font-bold text-gray-900">Selamat Datang</h5>
          <p className="text-sm">
            Silakan login dengan menggunakan username dan password yang anda
            miliki
          </p>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              Username
            </label>
            <input
              type="username"
              name="username"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="DGV47N2B"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              />
            </div>
            <label
              htmlFor="remember"
              className="ms-2 text-sm font-medium text-gray-900"
            >
              Ingat saya
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {pending ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginFormSiswa;
