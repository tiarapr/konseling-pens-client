import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import api from "@/api/api";
import Swal from "sweetalert2";
import Alert from "@/components/ui/alert/Alert";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/authentication", { email, password });
      const data = response.data;

      if (data.status === "success") {
        navigate("/otp", { state: { email } });
      } else {
        Swal.fire("Gagal", data.message || "Login gagal. Silakan coba lagi.", "error");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="w-full max-w-md pb-10 mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="size-5" />
            Kembali ke Beranda
          </Link>
        </div>

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Masuk Akun
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan email dan kata sandi Anda untuk masuk.
            </p>
          </div>

          {error && (
            <div className="text-sm mb-6">
              <Alert variant="error" title={error} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="user@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  Kata Sandi <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              {error && (
                <div className="text-sm">
                  {error.includes("Verifikasi email anda terlebih dahulu untuk mengaktifkan akun.") && (
                    <p className="mt-2 text-gray-600">
                      Belum menerima email verifikasi?{" "}
                      <Link
                        to="/resend-verification-email"
                        state={{ email }}
                        className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        Klik di sini untuk kirim ulang
                      </Link>
                    </p>
                  )}
                </div>
              )}

              <div>
                <Button className="w-full" size="sm" type="submit" disabled={loading}>
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Belum punya akun?{" "}
              <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
