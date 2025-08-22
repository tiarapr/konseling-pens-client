import { FaStar } from "react-icons/fa";
import PENSBuilding from "/images/pens/Gedung-Politeknik-Elektronika-Negeri-Surabaya.jpg";
import Container from "@/components/container/Container";

export default function AboutSection() {
    return (
        <section id="about" className="my-16">
            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                        <div className="relative shadow-theme-md rounded-xl overflow-hidden">
                            <img
                                src={PENSBuilding}
                                alt="PENS building"
                                className="w-full object-cover h-64 sm:h-72 md:h-80 lg:h-72"
                            />
                            <div className="absolute bottom-4 left-4 bg-white rounded-full shadow px-4 py-2 flex items-center gap-2">
                                <span className="font-bold text-sm sm:text-base">Quality over Quantity</span>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="text-warning-400 text-sm sm:text-base" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 pr-6">
                        <h2 className="text-title-sm font-semibold mb-6">
                            Pelayanan terbaik dari para Ahli Psikologi
                        </h2>
                        <p className="text-gray-500 text-theme-lg leading-relaxed">
                            Sistem Informasi Layanan Konseling PENS hadir untuk memberikan kemudahan bagi mahasiswa dalam mengakses layanan konseling secara online maupun offline. Kami berkomitmen untuk menyediakan platform yang efektif, cepat, dan nyaman guna mendukung kesehatan mental mahasiswa.
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}
