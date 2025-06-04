import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Homepage from '../pages/Homepage/Homepage';
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import OtpVerification from "../pages/AuthPages/OTPVerification";
import ForgotPassword from "../pages/AuthPages/ForgotPassword";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import ResendVerificationEmail from "../pages/AuthPages/ResendVerificationEmail";
import AppLayout from '../layout/AppLayout';
import Dashboard from "../pages/DashboardHomepage/Dashboard";
import VerifyEmailPage from '../pages/AuthPages/VerifyEmail';
import JanjiTemu from "../pages/MasterDashboard/JanjiTemu/JanjiTemu";
import Konseling from "../pages/MasterDashboard/Konseling/Konseling";
import Calendar from "../pages/MasterDashboard/Konseling/Calendar";
import CatatanKonseling from "../pages/MasterDashboard/CatatanKonseling/CatatanKonseling";
import RiwayatKonseling from "../pages/MasterDashboard/Konseling/RiwayatKonseling";
import DetailCatatanKonseling from "../pages/MasterDashboard/CatatanKonseling/DetailCatatanKonseling";
import Role from "../pages/MasterDashboard/RolePermission/Role";
import RolePermission from "../pages/MasterDashboard/RolePermission/RolePermission";
import Permission from "../pages/MasterDashboard/RolePermission/Permission";
import Department from "../pages/UniversityData/Departement";
import ProgramStudi from "../pages/UniversityData/ProgramStudi";
import Mahasiswa from "../pages/UserManagement/UserMahasiswa";
import Admin from "../pages/UserManagement/UserAdmin";
import Konselor from "../pages/UserManagement/UserKonselor";
import Kemahasiswaan from "../pages/UserManagement/UserKemahasiswaan";
import MasterProfile from "../pages/MasterDashboard/Profile/MasterProfile";
import JanjiTemuAdmin from '../pages/AdminDashboard/JanjiTemu/JanjiTemuAdmin';
import MahasiswaPengajuJanjiTemu from '../pages/AdminDashboard/MahasiswaPengajuJanjiTemu/MahasiswaPengajuJanjiTemu';
import KalenderJadwalKonseling from '../pages/AdminDashboard/Konseling/KalenderJadwalKonseling';
import KonselingAdmin from '../pages/AdminDashboard/Konseling/KonselingAdmin';
import AdminProfile from '../pages/AdminDashboard/Profile/AdminProfile';
import KonselingKonselor from '../pages/KonselorDashboard/Konseling/KonselingKonselor';
import KalenderJadwalKonselingKonselor from '../pages/KonselorDashboard/Konseling/KalenderJadwalKonselingKonselor';
import RiwayatKonselingKonselor from '../pages/KonselorDashboard/Konseling/RiwayatKonselingKonselor';
import DataMahasiswaKonselor from '../pages/KonselorDashboard/MahasiswaData/DataMahasiswaKonselor';
import KonselorProfile from '../pages/KonselorDashboard/Profile/KonselorProfile';
import CatatanKonselingKonselor from '../pages/KonselorDashboard/CatatanKonseling/AddCatatanKonselingKonselor';
import DetailCatatanKonselingKonselor from '../pages/KonselorDashboard/CatatanKonseling/DetailCatatanKonselingKonselor';
import NotFound from '../pages/OtherPage/NotFound';
import EditCatatanKonselingKonselor from '../pages/KonselorDashboard/CatatanKonseling/EditCatatanKonselingKonselor';
import AddCatatanKonselingKonselor from '../pages/KonselorDashboard/CatatanKonseling/AddCatatanKonselingKonselor';
import JanjiTemuKemahasiswaan from '../pages/KemahasiswaanDashboard/JanjiTemu/JanjiTemuKemahasiswaan';
import KonselingKemahasiswaan from '../pages/KemahasiswaanDashboard/Konseling/KonselingKemahasiswaan';
import KalenderJadwalKonselingKemahasiswaan from '../pages/KemahasiswaanDashboard/Konseling/KalenderJadwalKonselingKemahasiswaan';
import KemahasiswaanProfile from '../pages/KemahasiswaanDashboard/Profile/KemahasiswaanProfile';
import RekamMedis from '../pages/KonselorDashboard/MahasiswaData/RekamMedis';
import JanjiTemuMahasiswa from '../pages/MahasiswaDashboard/JanjiTemu/JanjiTemuMahasiswa';
import KonselingMahasiswa from '../pages/MahasiswaDashboard/Konseling/KonselingMahasiswa';
import RiwayatKonselingMahasiswa from '../pages/MahasiswaDashboard/Konseling/RiwayatKonselingMahasiswa';
import KalenderJadwalKonselingMahasiswa from '../pages/MahasiswaDashboard/Konseling/KalenderJadwalKonselingMahasiswa';
import DetailCatatanKonselingMahasiswa from '../pages/MahasiswaDashboard/CatatanKonseling/DetailCatatanKonselingMahasiswa';
import PengajuanJanjiTemuMahasiswa from '../pages/MahasiswaDashboard/JanjiTemu/PengajuanJanjiTemuMahasiswa';
import MahasiswaAccount from '../pages/MahasiswaDashboard/Account/MahasiswaAccount';
import DashboardMahasiswa from '../pages/MahasiswaDashboard/Dashboard/Dashboard';
import EditMahasiswaProfil from '../pages/MahasiswaDashboard/Dashboard/EditMahasiswaProfil';

const router = createBrowserRouter([
    { path: '/', element: <Homepage /> },
    { path: '/not-found', element: <NotFound /> },
    { path: 'signup', element: <SignUp /> },
    { path: 'signin', element: <SignIn /> },
    { path: 'otp', element: <OtpVerification /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'reset-password', element: <ResetPassword /> },
    { path: 'verify-email', element: <VerifyEmailPage /> },
    { path: 'resend-verification-email', element: <ResendVerificationEmail /> },

    {
        path: 'master-dashboard',
        element: (
            <ProtectedRoute allowedRoles={['master']}>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'janji-temu', element: <JanjiTemu /> },
            { path: 'konseling', element: <Konseling /> },
            { path: 'jadwal-konseling', element: <Calendar /> },
            { path: 'konseling/:konselingId/catatan', element: <CatatanKonseling /> },
            { path: 'riwayat-konseling', element: <RiwayatKonseling /> },
            { path: 'catatan-konseling/:id', element: <DetailCatatanKonseling /> },
            { path: 'konseling/:konselingId/catatan/:catatanKonselingId', element: <CatatanKonseling /> },
            { path: 'role', element: <Role /> },
            { path: 'permission', element: <Permission /> },
            { path: 'role-permission', element: <RolePermission /> },
            { path: 'departement', element: <Department /> },
            { path: 'program-studi', element: <ProgramStudi /> },
            { path: 'user/mahasiswa', element: <Mahasiswa /> },
            { path: 'user/admin', element: <Admin /> },
            { path: 'user/konselor', element: <Konselor /> },
            { path: 'user/kemahasiswaan', element: <Kemahasiswaan /> },
            { path: 'profile', element: <MasterProfile /> }
        ]
    },
    {
        path: 'admin-dashboard',
        element: (
            <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'janji-temu', element: <JanjiTemuAdmin /> },
            { path: 'konseling', element: <KonselingAdmin /> },
            { path: 'jadwal-konseling', element: <KalenderJadwalKonseling /> },
            { path: 'mahasiswa', element: <MahasiswaPengajuJanjiTemu /> },
            { path: 'konselor', element: <Konselor /> },
            { path: 'profile', element: <AdminProfile /> }
        ]
    },
    {
        path: 'konselor-dashboard',
        element: (
            <ProtectedRoute allowedRoles={['konselor']}>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'konseling', element: <KonselingKonselor /> },
            { path: 'jadwal-konseling', element: <KalenderJadwalKonselingKonselor /> },
            { path: 'konseling/:konselingId/catatan', element: <AddCatatanKonselingKonselor /> },
            { path: 'riwayat-konseling', element: <RiwayatKonselingKonselor /> },
            { path: 'catatan-konseling/:id', element: <DetailCatatanKonselingKonselor /> },
            { path: 'konseling/:konselingId/catatan/:catatanKonselingId', element: <EditCatatanKonselingKonselor /> },
            { path: 'mahasiswa', element: <DataMahasiswaKonselor /> },
            { path: 'mahasiswa/:nrp/rekam-medis', element: <RekamMedis /> },
            { path: 'profile', element: <KonselorProfile /> }
        ]
    },
    {
        path: 'kemahasiswaan-dashboard',
        element: (
            <ProtectedRoute allowedRoles={['kemahasiswaan']}>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'janji-temu', element: <JanjiTemuKemahasiswaan /> },
            { path: 'konseling', element: <KonselingKemahasiswaan /> },
            { path: 'jadwal-konseling', element: <KalenderJadwalKonselingKemahasiswaan /> },
            { path: 'mahasiswa', element: <Mahasiswa /> },
            { path: 'user/admin', element: <Admin /> },
            { path: 'profile', element: <KemahasiswaanProfile /> }
        ]
    },
    {
        path: 'dashboard',
        element: (
            <ProtectedRoute allowedRoles={['mahasiswa']}>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <DashboardMahasiswa /> },
            { path: 'mahasiswa/:id/edit', element: <EditMahasiswaProfil /> },
            { path: 'janji-temu', element: <JanjiTemuMahasiswa /> },
            { path: 'janji-temu/new', element: <PengajuanJanjiTemuMahasiswa /> },
            { path: 'konseling', element: <KonselingMahasiswa /> },
            { path: 'jadwal-konseling', element: <KalenderJadwalKonselingMahasiswa /> },
            { path: 'riwayat-konseling', element: <RiwayatKonselingMahasiswa /> },
            { path: 'catatan-konseling/:id', element: <DetailCatatanKonselingMahasiswa/> },
            { path: 'setting/account', element: <MahasiswaAccount /> },
        ]
    }
]);

export default router;
