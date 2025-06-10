import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "@/features/auth/components/layout/AuthPageLayout";
import ResendVerificationEmailForm from "@/features/auth/components/forms/ResendVerificationEmailForm";

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
