import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "@/icons";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import api from "@/api/api";
import { AuthContext } from "@/context/AuthContext";

export default function OtpForm() {
  const { setUser } = useContext(AuthContext);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return (
      <div className="text-red-600 text-center mt-10">
        Email is missing. Redirect to login.
      </div>
    );
  }

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Harap masukkan 6 digit OTP lengkap");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 1. Verify OTP
      const verifyResponse = await api.post('/authentication/verify-otp', {
        email,
        otp: otpCode
      });

      // Check if verification was successful using the actual API response structure
      if (verifyResponse.data.status === "success") {
        // 2. Get user info
        const userResponse = await api.get('/user/me');
        const user = userResponse.data.data.user;

        // 3. Save to local storage
        localStorage.setItem('user', JSON.stringify(user));

        // 4. Update context
        setUser(user);

        // 5. Redirect based on role
        const redirectPath = {
          'master': '/master-dashboard',
          'admin': '/admin-dashboard',
          'konselor': '/konselor-dashboard',
          'kemahasiswaan': '/kemahasiswaan-dashboard',
          'mahasiswa': '/dashboard'
        }[user.role_name] || '/not-found';

        navigate(redirectPath);
      } else {
        throw new Error(verifyResponse.data.message || "OTP verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Verifikasi OTP gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendMessage("");
    try {
      const response = await api.post("/authentication/resend-otp", { email });
      setResendMessage(response.data.message);

      // Reset OTP input fields
      setOtp(["", "", "", "", "", ""]);

      // Focus on the first OTP input
      setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 100);
    } catch (err) {
      setResendMessage(err.response?.data?.message || err.message || "Failed to resend OTP.");
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
            Back to homepage
          </Link>
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              OTP Verification
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We've sent a verification code to your email: <strong>{email}</strong>
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>OTP Code <span className="text-error-500">*</span></Label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="text-center"
                    />
                  ))}
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}
              <div>
                <Button className="w-full" size="sm" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Resend OTP
              </button>
            </p>
            {resendMessage && (
              <p className="mt-2 text-sm text-center text-blue-600 dark:text-blue-400">
                {resendMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}