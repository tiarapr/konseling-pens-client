export default function RekamMedisDetailHeader({ studentData, calculateAge }) {
    if (!studentData) return null;

    return (
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
                        {studentData.jenis_kelamin === 'P' ? 'Perempuan' : studentData.jenis_kelamin === 'L' ? 'Laki-laki' : '-'}
                    </p>
                </div>
                <div className='space-y-2'>
                    <p className="text-sm text-gray-600">Tanggal Lahir:</p>
                    <p className="text-sm font-medium">
                        {studentData.tanggal_lahir ? (
                            <>
                                {new Date(studentData.tanggal_lahir).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
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
    );
}
