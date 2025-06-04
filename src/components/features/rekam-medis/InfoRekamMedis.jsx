import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import Badge from '../../ui/badge/Badge';

const InfoRekamMedis = ({ nrp }) => {
    const [rekamMedis, setRekamMedis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});
    const [studentData, setStudentData] = useState(null);

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        async function fetchRekamMedis() {
            try {
                const response = await api.get(`/mahasiswa/${nrp}/rekam-medis`);
                const data = response.data.data;
                const sortedRekamMedis = [...data.rekam_medis].sort((a, b) => b.pertemuan_ke - a.pertemuan_ke);
                setRekamMedis(sortedRekamMedis);

                setStudentData({
                    nama_lengkap: data.nama_lengkap,
                    nrp: data.nrp,
                    jenjang: data.jenjang,
                    program_studi: data.program_studi,
                    jenis_kelamin: data.jenis_kelamin,
                    tanggal_lahir: data.tanggal_lahir
                });

                const initialExpandedState = {};
                data.rekam_medis.forEach(item => {
                    initialExpandedState[item.konseling_id] = false;
                });
                setExpandedItems(initialExpandedState);
            } catch (err) {
                setError('Failed to fetch rekam medis data', err);
            } finally {
                setLoading(false);
            }
        }

        fetchRekamMedis();
    }, [nrp]);

    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    if (loading) {
        return <div className="p-5 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-5 text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="bg-white rounded-lg">
            <div className="mb-6">
                {studentData && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{studentData.nama_lengkap || 'Tidak ada nama tersedia'}</h2>
                        <div className="grid xl:grid-cols-3 grid-cols-1 gap-4">
                            <div className='space-y-2'>
                                <p className="text-sm text-gray-600">Program Studi:</p>
                                <p className="text-sm font-medium">{studentData.jenjang || '-'} {studentData.program_studi || '-'}</p>
                            </div>
                            <div className='space-y-2'>
                                <p className="text-sm text-gray-600">Jenis Kelamin:</p>
                                <p className="text-sm font-medium">
                                    {studentData.jenis_kelamin === 'P' ? 'Perempuan' :
                                        studentData.jenis_kelamin === 'L' ? 'Laki-laki' : '-'}
                                </p>
                            </div>
                            <div className='space-y-2'>
                                <p className="text-sm text-gray-600">Tanggal Lahir:</p>
                                <p className="text-sm font-medium">
                                    {studentData.tanggal_lahir ? (
                                        <>
                                            {new Date(studentData.tanggal_lahir).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                            <span className="text-gray-500 ml-2">
                                                ({calculateAge(studentData.tanggal_lahir)} tahun)
                                            </span>
                                        </>
                                    ) : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Konseling</h3>
            </div>

            {rekamMedis.length > 0 ? (
                <div className="space-y-4">
                    {rekamMedis.map((item) => (
                        <div
                            key={item.konseling_id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleExpand(item.konseling_id)}
                                className="w-full bg-gray-50 px-4 py-3 border-b border-gray-200 text-left flex justify-between items-center hover:bg-gray-100"
                            >
                                <div className='flex gap-6'>
                                    <Badge size="sm" color={item?.status?.warna}>
                                        {item?.status?.label || "Status Tidak Diketahui"}
                                    </Badge>
                                    <h3 className="font-medium text-theme-sm text-gray-800">
                                        Pertemuan Ke-{item.pertemuan_ke} - {new Date(item.tanggal_konseling).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </h3>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedItems[item.konseling_id] ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {expandedItems[item.konseling_id] && (
                                <div className="p-4">
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-700 mb-3">Detail Sesi</h4>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">Konselor</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                            {item.konselor}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">Tanggal Konseling</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(item.tanggal_konseling).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">Waktu</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                            {item.jam_mulai} - {item.jam_selesai}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">Tipe Konsultasi</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                            {item.tipe_konsultasi}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">Lokasi</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                            {item.lokasi}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-700 mb-3">Hasil Konseling</h4>

                                        {item.catatan_konseling ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Deskripsi Masalah:</p>
                                                    <p className="text-sm font-medium">
                                                        {item.catatan_konseling.deskripsi_masalah || '-'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500">Usaha yang Sudah Dilakukan:</p>
                                                    <p className="text-sm font-medium">
                                                        {item.catatan_konseling.usaha || '-'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500">Kendala yang Dihadapi:</p>
                                                    <p className="text-sm font-medium">
                                                        {item.catatan_konseling.kendala || '-'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500">Pencapaian:</p>
                                                    <p className="text-sm font-medium">
                                                        {item.catatan_konseling.pencapaian || '-'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500">Diagnosis:</p>
                                                    <p className="text-sm font-medium">
                                                        {item.catatan_konseling.diagnosis || '-'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500">Intervensi:</p>
                                                    <p className="text-sm font-medium">
                                                        {item.catatan_konseling.intervensi || '-'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500">Tindak Lanjut:</p>
                                                    <p className="text-sm font-medium">
                                                        {item.catatan_konseling.tindak_lanjut || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">Tidak ada catatan konseling untuk sesi ini</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    Tidak ada rekam medis ditemukan.
                </p>
            )}
        </div>
    );
};

export default InfoRekamMedis;