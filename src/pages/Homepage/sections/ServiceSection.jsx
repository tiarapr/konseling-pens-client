import Container from "../../../components/container/Container";

const services = [
    { id: 1, title: "Pribadi", description: "Layanan konseling pribadi untuk membantu permasalahan individu." },
    { id: 2, title: "Akademik", description: "Bantuan untuk mengatasi tantangan akademik dan belajar." },
    { id: 3, title: "Keluarga", description: "Dukungan dalam menghadapi masalah keluarga dan relasi." },
    { id: 4, title: "Sosial", description: "Konseling untuk permasalahan sosial dan lingkungan." },
    { id: 5, title: "Karir", description: "Bimbingan pengembangan karir dan masa depan." },
    { id: 6, title: "Bakat minat", description: "Menggali dan mengembangkan bakat serta minat mahasiswa." },
];

export default function ServiceSection() {
    return (
        <section id="layanan" className="py-10">
            <Container>
                <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <div className="md:w-1/3">
                        <h3 className="text-title-sm font-semibold">Daftar Layanan</h3>
                    </div>
                    <div className="md:w-2/3">
                        <p className="text-gray-500 text-theme-lg">
                            Layanan Konseling adalah bagian integral dari suatu organisasi sosial dan kesehatan untuk memberikan dukungan kepada mahasiswa agar mereka dapat menyelesaikan permasalahan secara lebih efektif, serta memberikan dampak positif pada kegiatan belajar.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-theme-sm p-6 h-full flex flex-col"
                        >
                            <h4 className="text-theme-xl font-semibold mb-2">{service.title}</h4>
                            <p className="text-gray-500 text-theme-sm">{service.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
