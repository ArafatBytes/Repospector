"use client";

import Link from "next/link";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Check your email for password reset instructions");
      setEmail("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer position="top-center" />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CB218E] to-[#6617CB] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center">
                Recover Password
              </h1>
              <p className="text-center text-gray-500 mt-2">
                Enter your email address and we&apos;ll send you instructions to
                reset your password.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <div className="flex items-center">
                      <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer pr-10 placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#834CFF]"
                        placeholder="Email address"
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
                      Email Address
                    </label>
                  </div>
                  <div className="relative text-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#834CFF] text-white rounded-md px-4 py-2 mt-4 hover:bg-[#6617CB] transition-colors disabled:opacity-50 w-full"
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <Link
              href="/login"
              className="text-[#834CFF] block text-center mt-4"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
