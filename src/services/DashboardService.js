import api from "../api/api";

export const getDashboardSummary = async () => {
    try {
        const response = await api.get(`/dashboard/summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw error;
    }
};

export const getAppointmentTrends = async (days = 30) => {
    try {
        const response = await api.get(`/janji-temu/trends`, {
            params: { days },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching appointment trends:', error);
        throw error;
    }
};

export const getMonthlyAppointmentSummary = async () => {
    try {
        const response = await api.get(`/janji-temu/monthly-summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly appointment summary:', error);
        throw error;
    }
};

export const getMonthlyCounselingSummary = async () => {
    try {
        const response = await api.get(`/konseling/monthly-summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly counseling summary:', error);
        throw error;
    }
};

// Mendapatkan Kinerja Konselor
export const getCounselorPerformance = async (limit = 5) => {
    try {
        const response = await api.get(`/konselor/performance`, {
            params: { limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching counselor performance:', error);
        throw error;
    }
};

// Mendapatkan Distribusi Jenis Konsultasi
export const getConsultationTypesDistribution = async () => {
    try {
        const response = await api.get(`/janji-temu/consultation-types`);
        return response.data;
    } catch (error) {
        console.error('Error fetching consultation types distribution:', error);
        throw error;
    }
};

// Mendapatkan Statistik Per Departemen
export const getDepartmentStats = async () => {
    try {
        const response = await api.get(`/department/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching department stats:', error);
        throw error;
    }
};

// Mendapatkan Ringkasan Harian (Tren Harian)
export const getDailySummary = async (days = 7) => {
    try {
        const response = await api.get(`/daily-summary`, {
            params: { days },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching daily summary:', error);
        throw error;
    }
};

// Mendapatkan Rata-Rata Rating
export const getAverageRating = async () => {
    try {
        const response = await api.get(`/rating/average`);
        return response.data;
    } catch (error) {
        console.error('Error fetching average rating:', error);
        throw error;
    }
};

// Mendapatkan Total Pengajuan per Prodi dan Jenjang
export const getTotalPengajuanPerProdiJenjang = async () => {
    try {
        const response = await api.get(`/janji-temu/prodi/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching total pengajuan per prodi jenjang:', error);
        throw error;
    }
};

// Mendapatkan Demografi Mahasiswa per Prodi
export const getDemografiMahasiswaPerProdi = async () => {
    try {
        const response = await api.get(`/mahasiswa/prodi/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching demografi mahasiswa per prodi:', error);
        throw error;
    }
};
