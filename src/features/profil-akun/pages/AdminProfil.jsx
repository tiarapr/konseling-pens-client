import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { ToastContainer } from "react-toastify";
import UserFieldCard from "@/components/user-card/UserFieldCard";
import UserPasswordCard from "@/components/user-card/UserPasswordCard";
import AdminProfileCard from "../components/cards/AdminProfilCard";

export default function AdminProfil() {
  return (
    <>
      <PageMeta
        title="Konseling PENS Dashboard | Admin Profil"
        description="Halaman profil admin"
      />
      <PageBreadcrumb pageTitle="My Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 lg:p-6">
        <div className="space-y-6">
          <AdminProfileCard />
          <UserFieldCard
            title="Email"
            fieldKey="email"
            label="Email"
            placeholder="+62 812-3456-7890"
            endpoint="/user/:id/email"
            fieldName="email"
            inputType="text"
          />
          <UserFieldCard
            title="Phone Number"
            fieldKey="phone_number"
            label="Phone Number"
            placeholder="6281234567890"
            endpoint="/user/:id/phone"
            fieldName="phoneNumber"
            inputType="text"
          />
          <UserPasswordCard />
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
