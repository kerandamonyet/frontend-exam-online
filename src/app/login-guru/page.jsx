"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const LoginFormGuru = () => {
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(false);

  // Validasi form
  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email tidak boleh kosong.";
      valid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newErrors.email = "Format email tidak valid.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password tidak boleh kosong.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password harus minimal 6 karakter.";
      valid = false;
    } else if (password.length > 20) {
      newErrors.password = "Password tidak boleh lebih dari 20 karakter.";
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
    console.log("🔄 [LOGIN] Mengirim data:", { email, password });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
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

      router.push("/guru");
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
          <h5 className="text-xl font-medium text-gray-900">
            Login ke dashboard guru
          </h5>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="nama@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
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

export default LoginFormGuru;
