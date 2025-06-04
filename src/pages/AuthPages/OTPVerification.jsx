import PageMeta from "../../components/common/PageMeta";
import OtpForm from "../../components/features/auth/OTPForm";
import AuthLayout from "./AuthPageLayout";

export default function OtpVerification() {
  return (
    <>
      <PageMeta
        title="Konseling PENS | Verifikasi OTP"
        description="Halaman verifikasi OTP"
      />
      <AuthLayout>
        <OtpForm />
      </AuthLayout>
    </>
  );
}