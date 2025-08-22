import PageMeta from "@/components/common/PageMeta";
import ResetPasswordForm from "@/features/auth/components/forms/ResetPasswordForm";
import AuthLayout from "@/features/auth/components/layout/AuthPageLayout";

export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="Konseling PENS | Reset Password"
        description="Halaman reset password"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
