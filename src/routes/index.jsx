import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '@/features/homepage/pages/Homepage';
import NotFound from '@/features/NotFound';
import SignUp from '@/features/auth/pages/SignUp';
import SignIn from '@/features/auth/pages/SignIn';
import OtpVerification from '@/features/auth/pages/OTPVerification';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import VerifyEmailPage from '@/features/auth/pages/VerifyEmail';
import ResendVerificationEmail from '@/features/auth/pages/ResendVerificationEmail';
import AppLayout from '@/layout/AppLayout';
import MasterDashboard from '@/features/dashboard/pages/MasterDashboard';
import MasterJanjiTemu from '@/features/janji-temu/pages/MasterJanjiTemu';
import MasterKonseling from '@/features/konseling/pages/MasterKonseling';
import MasterKalenderKonseling from '@/features/kalender-konseling/pages/MasterKalenderKonseling';
import MasterTambahCatatanKonseling from '@/features/catatan-konseling/pages/MasterTambahCatatanKonseling';
import MasterRiwayatKonseling from '@/features/riwayat-konseling/pages/MasterRiwayatKonseling';
import MasterDetailCatatanKonseling from '@/features/catatan-konseling/pages/MasterDetailCatatanKonseling';
import Role from '@/features/role/pages/Role';
import Permission from '@/features/permission/pages/Permission';
import RolePermission from '@/features/role-permission/pages/RolePermission';
import MasterEditCatatanKonseling from '@/features/catatan-konseling/pages/MasterEditCatatanKonseling';
import Department from '@/features/departement/pages/Departement';
import ProgramStudi from '@/features/program-studi/pages/ProgramStudi';
import Mahasiswa from '@/features/user-management/mahasiswa/pages/UserMahasiswa';
import Admin from '@/features/user-management/admin/pages/UserAdmin';
import Konselor from '@/features/user-management/konselor/pages/UserKonselor';
import Kemahasiswaan from '@/features/user-management/kemahasiswaan/pages/UserKemahasiswaan';
import AdminDashboard from '@/features/dashboard/pages/AdminDashboard';
import AdminManajemenJanjiTemu from '@/features/janji-temu/pages/AdminManajemenJanjiTemu';
import AdminManajemenKonseling from '@/features/konseling/pages/AdminManajemenKonseling';
import AdminKalenderKonseling from '@/features/kalender-konseling/pages/AdminKalenderKonseling';
import AdminListMahasiswaPengajuJanjiTemu from '@/features/mahasiswa-pengaju-janji-temu/pages/AdminListMahasiswaPengajuJanjiTemu';
import AdminProfil from '@/features/profil-akun/pages/AdminProfil';
import MasterProfil from '@/features/profil-akun/pages/MasterProfil';
import KonselorDashboard from '@/features/dashboard/pages/KonselorDashboard';
import KonselorKonseling from '@/features/konseling/pages/KonselorKonseling';
import KonselorKalenderKonseling from '@/features/kalender-konseling/pages/KonselorKalenderKonseling';
import KonselorTambahCatatanKonseling from '@/features/catatan-konseling/pages/KonselorTambahCatatanKonseling';
import KonselorRiwayatKonseling from '@/features/riwayat-konseling/pages/KonselorRiwayatKonseling';
import KonselorDetailCatatanKonseling from '@/features/catatan-konseling/pages/KonselorDetailCatatanKonseling';
import KonselorEditCatatanKonseling from '@/features/catatan-konseling/pages/KonselorEditCatatanKonseling';
import KonselorListMahasiswaKonseling from '@/features/rekam-medis/pages/KonselorListMahasiswaKonseling';
import RekamMedisDetail from '@/features/rekam-medis/pages/KonselorRekamMedisDetail';
import KonselorProfil from '@/features/profil-akun/pages/KonselorProfil';
import KemahasiswaanDashboard from '@/features/dashboard/pages/KemahasiswaanDashboard';
import KemahasiswaanJanjiTemuList from '@/features/janji-temu/pages/KemahasiswaanJanjiTemuList';
import KemahasiswaanKonselingList from '@/features/konseling/pages/KemahasiswaanKonselingList';
import KemahasiswaanKalenderKonseling from '@/features/kalender-konseling/pages/KemahasiswaanKalenderKonseling';
import KemahasiswaanProfil from '@/features/profil-akun/pages/KemahasiswaanProfil';
import MahasiswaEditProfil from '@/features/profil-akun/pages/MahasiswaEditProfil';
import MahasiswaJanjiTemu from '@/features/janji-temu/pages/MahasiswaJanjiTemu';
import PengajuanJanjiTemu from '@/features/janji-temu/pages/PengajuanJanjiTemu';
import MahasiswaKonseling from '@/features/konseling/pages/MahasiswaKonseling';
import MahasiswaKalenderKonseling from '@/features/kalender-konseling/pages/MahasiswaKalenderKonseling';
import MahasiswaRiwayatKonseling from '@/features/riwayat-konseling/pages/MahasiswaRiwayatKonseling';
import MahasiswaDetailCatatanKonseling from '@/features/catatan-konseling/pages/MahasiswaDetailCatatanKonseling';
import MahasiswaAkun from '@/features/profil-akun/pages/MahasiswaAkun';
import MahasiswaProfil from '@/features/profil-akun/pages/MahasiswaProfil';
import AdminRiwayatKonseling from '@/features/riwayat-konseling/pages/AdminRiwayatKonseling';

const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
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
            { index: true, element: <MasterDashboard /> },
            { path: 'janji-temu', element: <MasterJanjiTemu /> },
            { path: 'konseling', element: <MasterKonseling /> },
            { path: 'jadwal-konseling', element: <MasterKalenderKonseling /> },
            { path: 'konseling/:konselingId/catatan', element: <MasterTambahCatatanKonseling /> },
            { path: 'riwayat-konseling', element: <MasterRiwayatKonseling /> },
            { path: 'catatan-konseling/:id', element: <MasterDetailCatatanKonseling /> },
            { path: 'catatan-konseling/:id/edit', element: <MasterEditCatatanKonseling /> },
            { path: 'role', element: <Role /> },
            { path: 'permission', element: <Permission /> },
            { path: 'role-permission', element: <RolePermission /> },
            { path: 'departement', element: <Department /> },
            { path: 'program-studi', element: <ProgramStudi /> },
            { path: 'user/mahasiswa', element: <Mahasiswa /> },
            { path: 'user/admin', element: <Admin /> },
            { path: 'user/konselor', element: <Konselor /> },
            { path: 'user/kemahasiswaan', element: <Kemahasiswaan /> },
            { path: 'profile', element: <MasterProfil /> }
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
            { index: true, element: <AdminDashboard /> },
            { path: 'janji-temu', element: <AdminManajemenJanjiTemu /> },
            { path: 'konseling', element: <AdminManajemenKonseling /> },
            { path: 'jadwal-konseling', element: <AdminKalenderKonseling /> },
            { path: 'riwayat-konseling', element: <AdminRiwayatKonseling /> },
            { path: 'mahasiswa', element: <AdminListMahasiswaPengajuJanjiTemu /> },
            { path: 'konselor', element: <Konselor /> },
            { path: 'profile', element: <AdminProfil /> }
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
            { index: true, element: <KonselorDashboard /> },
            { path: 'konseling', element: <KonselorKonseling /> },
            { path: 'jadwal-konseling', element: <KonselorKalenderKonseling /> },
            { path: 'konseling/:konselingId/catatan', element: <KonselorTambahCatatanKonseling /> },
            { path: 'riwayat-konseling', element: <KonselorRiwayatKonseling /> },
            { path: 'catatan-konseling/:id', element: <KonselorDetailCatatanKonseling /> },
            { path: 'catatan-konseling/:id/edit', element: <KonselorEditCatatanKonseling /> },
            { path: 'mahasiswa', element: <KonselorListMahasiswaKonseling /> },
            { path: 'mahasiswa/:nrp/rekam-medis', element: <RekamMedisDetail /> },
            { path: 'profile', element: <KonselorProfil /> }
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
            { index: true, element: <KemahasiswaanDashboard /> },
            { path: 'janji-temu', element: <KemahasiswaanJanjiTemuList /> },
            { path: 'konseling', element: <KemahasiswaanKonselingList /> },
            { path: 'jadwal-konseling', element: <KemahasiswaanKalenderKonseling /> },
            { path: 'mahasiswa', element: <Mahasiswa /> },
            { path: 'user/admin', element: <Admin /> },
            { path: 'profile', element: <KemahasiswaanProfil /> }
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
            { index: true, element: <MahasiswaProfil /> },
            { path: 'mahasiswa/:id/edit', element: <MahasiswaEditProfil /> },
            { path: 'janji-temu', element: <MahasiswaJanjiTemu /> },
            { path: 'janji-temu/new', element: <PengajuanJanjiTemu /> },
            { path: 'konseling', element: <MahasiswaKonseling /> },
            { path: 'jadwal-konseling', element: <MahasiswaKalenderKonseling /> },
            { path: 'riwayat-konseling', element: <MahasiswaRiwayatKonseling /> },
            { path: 'catatan-konseling/:id', element: <MahasiswaDetailCatatanKonseling/> },
            { path: 'setting/account', element: <MahasiswaAkun /> },
        ]
    }
]);

export default router;
