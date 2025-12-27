"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { TrinitiLogoIcon } from "../../components/icons/TrinitiLogoIcon";
import { SpinnerIcon } from "../../components/icons/SpinnerIcon";
import type { User } from "../../types";
import Modal from "../../components/ui/Modal";
import { UsersIcon } from "../../components/icons/UsersIcon";
import { DemoAccounts } from "./components/DemoAccounts";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUIStore } from "../../stores/useUIStore";
import { EyeIcon } from "../../components/icons/EyeIcon";
import { EyeSlashIcon } from "../../components/icons/EyeSlashIcon";

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<User>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const loginStore = useAuthStore((state) => state.login);
  const setActivePage = useUIStore((state) => state.setActivePage);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan kata sandi harus diisi.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setIsLoading(true);

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      await loginStore(email, password);
      setActivePage("dashboard");
      if (onLogin) {
        await onLogin(email, password);
      }
    } catch (err: any) {
      const message = err.message || "Gagal untuk login.";
      if (
        message.includes("not found") ||
        message.includes("Invalid credentials")
      ) {
        setError("Email atau kata sandi yang Anda masukkan salah.");
      } else {
        setError("Terjadi kesalahan pada server. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Akun Uji Coba (Demo)"
        size="md"
      >
        <DemoAccounts />
      </Modal>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-tm-dark relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <TrinitiLogoIcon className="w-10 h-10 text-tm-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Triniti
                  <span className="font-normal text-slate-300">Asset</span>
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Inventory System
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-lg">
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight text-balance">
                Kelola Aset dengan Lebih{" "}
                <span className="text-tm-accent">Efisien</span>
              </h2>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                Sistem manajemen inventori terpadu untuk memantau, melacak, dan
                mengelola seluruh aset perusahaan dalam satu platform.
              </p>

              {/* Features */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Real-time Tracking",
                    desc: "Pantau aset secara langsung",
                  },
                  {
                    title: "Multi-lokasi",
                    desc: "Kelola aset di berbagai lokasi",
                  },
                  {
                    title: "Laporan Lengkap",
                    desc: "Analisis data komprehensif",
                  },
                  { title: "QR Code Scanner", desc: "Identifikasi aset cepat" },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <h3 className="font-semibold text-white text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PT. Triniti Media Indonesia
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="flex flex-col items-center justify-center mb-8 lg:hidden">
              <div className="p-4 bg-tm-primary-light rounded-2xl mb-4">
                <TrinitiLogoIcon className="w-12 h-12 text-tm-primary" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Triniti<span className="font-normal text-slate-500">Asset</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Sistem Manajemen Inventori
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/60 animate-zoom-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Selamat Datang
                </h2>
                <p className="mt-2 text-slate-500">
                  Masuk untuk melanjutkan ke dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full h-12 px-4 text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tm-accent/30 focus:border-tm-accent hover:border-slate-400"
                    placeholder="anda@triniti.com"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full h-12 px-4 pr-12 text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tm-accent/30 focus:border-tm-accent hover:border-slate-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="remember-me"
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div className="relative">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="sr-only peer"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="w-10 h-6 bg-slate-200 rounded-full transition-colors peer-checked:bg-tm-primary group-hover:bg-slate-300 peer-checked:group-hover:bg-tm-primary-hover peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-tm-accent" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm peer-checked:translate-x-4" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium">
                      Ingat saya
                    </span>
                  </label>

                  <a
                    href="#"
                    className="text-sm font-semibold text-tm-primary hover:text-tm-primary-hover transition-colors"
                  >
                    Lupa kata sandi?
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center w-full h-12 text-base font-semibold text-white transition-all duration-200 rounded-xl shadow-lg bg-tm-primary hover:bg-tm-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tm-accent disabled:bg-tm-primary/60 disabled:cursor-wait active:scale-[0.98] shadow-tm-primary/20"
                >
                  {isLoading ? (
                    <>
                      <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </form>

              {/* Demo accounts link */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-tm-primary transition-colors"
                >
                  <UsersIcon className="w-4 h-4" />
                  Lihat Akun Demo
                </button>
              </div>
            </div>

            {/* Footer for mobile */}
            <p className="mt-8 text-xs text-center text-slate-400 lg:hidden">
              © {new Date().getFullYear()} PT. Triniti Media Indonesia
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
