import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import api from "../../../api/api";
import Swal from "sweetalert2";

export default function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
    const navigate = useNavigate();
    const location = useLocation();

    const token = new URLSearchParams(location.search).get("token"); // Get token from URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!token) {
            setError("Invalid or missing token.");
            setLoading(false);
            navigate("/forgot-password"); // Redirect to forgot password if token is invalid
            return;
        }

        try {
            const response = await api.post(`/reset-password?token=${token}`, {
                password: newPassword,
            });

            const data = response.data;

            if (data.status === "success") {
                // Show success SweetAlert
                Swal.fire({
                    title: "Success!",
                    text: data.message,
                    icon: "success",
                    confirmButtonText: "OK"
                });

                // Clear the input field after success
                setNewPassword("");

                // Redirect to sign-in page after success
                setTimeout(() => {
                    navigate("/signin");
                }, 3000);
            } else {
                // Show error SweetAlert
                Swal.fire({
                    title: "Error",
                    text: "Failed to reset password. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        } catch (err) {
            // Show error SweetAlert on failure
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Something went wrong.",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing token.");
            Swal.fire({
                title: "Error",
                text: "Invalid or missing token.",
                icon: "error",
                confirmButtonText: "OK"
            });
            navigate("/forgot-password");
        }
    }, [token, navigate]);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="w-full max-w-md pb-10 mx-auto">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        Reset Password
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your new password below.
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="relative">
                            <Label>New Password <span className="text-error-500">*</span></Label>
                            <Input
                                type={showPassword ? "text" : "password"}  // Toggle between password and text type
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute z-30 cursor-pointer right-4 top-1/2"
                            >
                                {showPassword ? (
                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                ) : (
                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                )}
                            </span>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {message && <p className="text-sm text-green-600">{message}</p>}
                        <div>
                            <Button className="w-full" size="sm" type="submit" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
