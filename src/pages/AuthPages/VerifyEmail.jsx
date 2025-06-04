import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Swal from 'sweetalert2';

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            Swal.fire({
                title: 'Verifikasi Gagal',
                text: 'Token tidak ditemukan. Silakan kirim ulang email verifikasi.',
                icon: 'error',
                confirmButtonText: 'Kirim Ulang'
            }).then(() => {
                navigate('/resend-verification-email');
            });
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await api.post('/verify-email', { token });

                if (response.data.status === 'success') {
                    Swal.fire({
                        title: 'Email Verified!',
                        text: 'Your email has been successfully verified.',
                        icon: 'success',
                        confirmButtonText: 'Go to Login'
                    }).then(() => {
                        navigate('/signin'); // Redirect ke halaman login
                    });

                } else {
                    console.error('Verification failed:', response.data);
                    Swal.fire({
                        title: 'Verifikasi Gagal',
                        text: 'Token tidak valid atau sudah kadaluarsa. Silakan kirim ulang email verifikasi.',
                        icon: 'error',
                        confirmButtonText: 'Kirim Ulang'
                    }).then(() => {
                        navigate('/resend-verification-email');
                    });
                }
            } catch (error) {
                console.error('Verification error:', error.response?.data || error.message);
                Swal.fire({
                    title: 'Verifikasi Gagal',
                    text: 'Token tidak valid atau sudah kadaluarsa. Silakan kirim ulang email verifikasi.',
                    icon: 'error',
                    confirmButtonText: 'Kirim Ulang'
                }).then(() => {
                    navigate('/resend-verification-email');
                });
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div></div>
    );
}

export default VerifyEmailPage;
