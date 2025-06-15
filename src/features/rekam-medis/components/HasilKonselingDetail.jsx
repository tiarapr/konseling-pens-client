export default function HasilKonselingDetail({ catatan }) {
    if (!catatan) {
        return <p className="text-sm text-gray-400 italic">Tidak ada catatan konseling untuk sesi ini</p>;
    }

    const fieldMap = [
        ['Deskripsi Masalah', catatan.deskripsi_masalah],
        ['Usaha yang Sudah Dilakukan', catatan.usaha],
        ['Kendala yang Dihadapi', catatan.kendala],
        ['Pencapaian', catatan.pencapaian],
        ['Diagnosis', catatan.diagnosis],
        ['Intervensi', catatan.intervensi],
        ['Tindak Lanjut', catatan.tindak_lanjut],
    ];

    return (
        <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-6">Hasil Konseling</h4>
            <div className="space-y-4">
                {fieldMap.map(([label, value]) => (
                    <div key={label} className="space-y-2">
                        <p className="text-xs text-gray-500">{label}:</p>
                        <p className="text-sm">{value || '-'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
