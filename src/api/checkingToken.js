import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fungsi untuk memeriksa apakah token sudah kedaluwarsa
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch {
        return true;
    }
};

// Fungsi untuk mengecek dan memperbarui token
export const checkAndRefreshToken = async () => {
    // Ambil access token dan refresh token dari cookies
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    // Jika tidak ada refresh token atau access token, tidak ada yang bisa diperbarui
    if (!accessToken || !refreshToken) {
        return null;
    }

    // Jika access token masih berlaku, tidak perlu memperbarui
    if (!isTokenExpired(accessToken)) {
        return accessToken;
    }

    try {
        // Kirim permintaan untuk memperbarui access token menggunakan refresh token
        const response = await axios.put(`${BASE_URL}/authentication`, {
            refreshToken: refreshToken
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${import.meta.env.VITE_BASIC_AUTH_USERNAME}:${import.meta.env.VITE_BASIC_AUTH_PASSWORD}`)}`
            },
            withCredentials: true,  // Membuat cookie dikirim otomatis dengan setiap permintaan
        });

        // Ambil access token baru dari respons
        const newAccessToken = response.data.accessToken;

        // Simpan access token baru di cookie
        Cookies.set('accessToken', newAccessToken, {
            expires: 60 / 60, // Token berlaku 15 menit
            // secure: import.meta.env.MODE === 'production',  // Hanya jika di environment produksi dan HTTPS
            sameSite: 'Strict',
        });

        return newAccessToken;

    } catch (error) {
        console.error('Token refresh failed:', error);

        // Jika gagal, hapus token yang ada dari cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        return null;
    }
};
