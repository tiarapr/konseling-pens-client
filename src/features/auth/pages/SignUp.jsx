import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "../components/layout/AuthPageLayout";
import SignUpForm from "../components/forms/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Konseling PENS | Sign Up"
        description="Halaman registrasi mahasiswa"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}