import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "@/features/auth/components/layout/AuthPageLayout";
import ForgotPasswordForm from "@/features/auth/components/forms/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Konseling PENS | Forgot Password"
        description="Halaman lupa password"
      />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}
