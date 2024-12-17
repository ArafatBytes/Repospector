"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarPreview,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful, redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CB218E] to-[#6617CB] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center">Register</h1>
            </div>
            {error && (
              <div className="text-red-500 text-center mt-2 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer text-sm text-[#834CFF] hover:text-[#6617CB]"
                    >
                      Choose Avatar
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        autoComplete="off"
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="peer pr-10 placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#834CFF]"
                        placeholder="name"
                        required
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute right-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <label
                      htmlFor="name"
                      className="absolute left-0 -top-3.5 text-[#ddd] text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="peer pr-10 placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#834CFF]"
                        placeholder="email"
                        required
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute right-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-[#ddd] text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email address
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        autoComplete="off"
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="peer pr-10 placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#834CFF]"
                        placeholder="username"
                        required
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute right-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <label
                      htmlFor="username"
                      className="absolute left-0 -top-3.5 text-[#ddd] text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Username
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        autoComplete="off"
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="peer pr-10 placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#834CFF]"
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 p-1"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5 text-gray-400 hover:text-[#834CFF] transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-gray-400 hover:text-[#834CFF] transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-[#ddd] text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative text-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#834CFF] text-white rounded-md px-4 py-2 mt-4 hover:bg-[#6617CB] transition-colors disabled:opacity-50"
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <Link
              href="/login"
              className="text-[#834CFF] block text-center mb-2"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
