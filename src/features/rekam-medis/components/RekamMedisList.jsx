import RekamMedisAccordion from "./RekamMedisAccordion";

export default function RekamMedisList({ rekamMedis, expandedItems, toggleExpand }) {
    if (rekamMedis.length === 0) {
        return <p className="text-center text-gray-500">Tidak ada rekam medis ditemukan.</p>;
    }

    return (
        <div className="space-y-4">
            {rekamMedis.map((item) => (
                <RekamMedisAccordion
                    key={item.konseling_id}
                    item={item}
                    isExpanded={expandedItems[item.konseling_id]}
                    onToggle={() => toggleExpand(item.konseling_id)}
                />
            ))}
        </div>
    );
}
