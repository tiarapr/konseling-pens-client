import { useState } from "react";
import { Link } from "react-router-dom";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import api from "@/api/api";
import Swal from "sweetalert2"; 
import { ChevronLeftIcon } from "@/icons";

export default function ResendVerificationEmailForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api.post("/resend-verification-email", {
                email: email,
            });

            const data = response.data;

            if (data.status === "success") {
                // Show SweetAlert notification
                Swal.fire({
                    title: "Sukses!",
                    text: data.message,
                    icon: "success",
                    confirmButtonText: "OK"
                });

                // Reset the email input field after success
                setEmail("");
            } else {
                setError("Gagal mengirim ulang email verifikasi. Silakan coba lagi.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="w-full max-w-md pb-10 mx-auto">
                    <Link
                        to="/signin"
                        className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <ChevronLeftIcon className="size-5" />
                        Kembali ke Beranda
                    </Link>
                </div>
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Kirim Ulang Email Verifikasi
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Masukkan alamat email Anda untuk menerima tautan verifikasi.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <Label>Email <span className="text-error-500">*</span></Label>
                                <Input
                                    type="email"
                                    placeholder="user@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            {message && <p className="text-sm text-green-600">{message}</p>}
                            <div>
                                <Button className="w-full" size="sm" type="submit" disabled={loading}>
                                    {loading ? "Sending..." : "Kirim Ulang Email Verifikasi"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
