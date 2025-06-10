import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "../components/layout/AuthPageLayout";
import OtpForm from "../components/forms/OTPForm";

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