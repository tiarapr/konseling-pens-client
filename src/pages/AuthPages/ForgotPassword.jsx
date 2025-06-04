import PageMeta from "../../components/common/PageMeta";
import ForgotPasswordForm from "../../components/features/auth/ForgotPasswordForm";
import AuthLayout from "./AuthPageLayout";

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
