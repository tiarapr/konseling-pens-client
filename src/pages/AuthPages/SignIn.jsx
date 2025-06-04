import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/features/auth/SignInForm";

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
