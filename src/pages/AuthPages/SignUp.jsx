import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/features/auth/SignUpForm";
import { ToastContainer } from "react-toastify";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Konseling PENS | Sign Up"
        description="Halaman registrasi mahasiswa"
      />
      <AuthLayout>
        <SignUpForm />
        <ToastContainer />
      </AuthLayout>
    </>
  );
}