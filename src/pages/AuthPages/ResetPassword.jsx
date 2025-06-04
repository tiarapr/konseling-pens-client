import PageMeta from "../../components/common/PageMeta";
import ResetPasswordForm from "../../components/features/auth/ResetPasswordForm";
import AuthLayout from "./AuthPageLayout";

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
