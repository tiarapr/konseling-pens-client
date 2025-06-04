import PageMeta from "../../components/common/PageMeta";
import ResendVerificationEmailForm from "../../components/features/auth/ResendVerificationEmailForm";
import AuthLayout from "./AuthPageLayout";

export default function ResendVerificationEmail() {
  return (
    <>
      <PageMeta
        title="Konseling PENS | Kirim ulang verifikasi email"
        description="Halaman kirim ulang link verifikasi email"
      />
      <AuthLayout>
        <ResendVerificationEmailForm />
      </AuthLayout>
    </>
  );
}
