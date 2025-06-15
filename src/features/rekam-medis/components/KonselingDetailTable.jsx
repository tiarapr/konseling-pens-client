export default function KonselingDetailTable({ item }) {
    return (
        <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Detail Sesi</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr><td className="px-4 py-2 text-sm font-medium text-gray-500">Konselor</td><td className="px-4 py-2 text-sm">{item.konselor}</td></tr>
                        <tr><td className="px-4 py-2 text-sm font-medium text-gray-500">Tanggal Konseling</td><td className="px-4 py-2 text-sm">{new Date(item.tanggal_konseling).toLocaleDateString('id-ID')}</td></tr>
                        <tr><td className="px-4 py-2 text-sm font-medium text-gray-500">Waktu</td><td className="px-4 py-2 text-sm">{item.jam_mulai} - {item.jam_selesai}</td></tr>
                        <tr><td className="px-4 py-2 text-sm font-medium text-gray-500">Tipe Konsultasi</td><td className="px-4 py-2 text-sm">{item.tipe_konsultasi}</td></tr>
                        <tr><td className="px-4 py-2 text-sm font-medium text-gray-500">Lokasi</td><td className="px-4 py-2 text-sm">{item.lokasi}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
