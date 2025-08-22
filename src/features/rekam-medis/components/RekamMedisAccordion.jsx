import Badge from "@/components/ui/badge/Badge";
import KonselingDetailTable from "./KonselingDetailTable";
import HasilKonselingDetail from "./HasilKonselingDetail";

export default function RekamMedisAccordion({ item, isExpanded, onToggle }) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full bg-gray-50 px-4 py-3 border-b border-gray-200 text-left flex justify-between items-center hover:bg-gray-100"
            >
                <div className="flex gap-6">
                    <Badge size="sm" color={item?.status?.warna}>
                        {item?.status?.label || "Status Tidak Diketahui"}
                    </Badge>
                    <h3 className="font-medium text-theme-sm text-gray-800">
                        Pertemuan Ke-{item.pertemuan_ke} - {new Date(item.tanggal_konseling).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </h3>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="p-4">
                    <KonselingDetailTable item={item} />
                    <HasilKonselingDetail catatan={item.catatan_konseling} />
                </div>
            )}
        </div>
    );
}
