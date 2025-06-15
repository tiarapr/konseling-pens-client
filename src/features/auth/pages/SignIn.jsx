import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "../components/layout/AuthPageLayout";
import SignInForm from "../components/forms/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Konseling PENS | Sign In"
        description="Halaman Sign In"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
