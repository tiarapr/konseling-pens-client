import HeroIllustration from "/images/illustration/HeroIllustration.png";
import { ChevronDownIcon } from "@/icons";
import Container from "@/components/container/Container";

export default function HeroSection() {
    return (
        <section id="beranda" className="pt-24 pb-16 bg-brand-25">
            <Container>
                <div className="flex flex-col-reverse lg:flex-row items-center px-4 md:px-16 gap-12">
                    <div className="lg:w-1/2 mt-8">
                        <h1 className="text-brand-500 text-title-md lg:text-title-md font-bold mb-6 leading-tight">
                            Kami siap mendengarkan ceritamu.
                        </h1>
                        <p className="text-gray-500 text-theme-lg mb-6 max-w-xl">
                            Ceritakan kepada kami dan dapatkan bimbingan serta dukungan profesional melalui layanan konseling online maupun offline yang mudah diakses dan nyaman. Kami siap membantu Anda dalam menghadapi tantangan akademik, pribadi, maupun karir.
                        </p>
                        <a
                            href="#layanan"
                            className="inline-flex items-center text-theme-sm gap-2 border border-brand-500 text-brand-500 rounded-full px-6 py-2 font-semibold shadow-theme-sm hover:bg-brand-50 transition"
                        >
                            Lihat Layanan <ChevronDownIcon />
                        </a>
                    </div>
                    <div className="lg:w-1/2 flex justify-center">
                        <img
                            src={HeroIllustration}
                            alt="Counseling illustration"
                            className="max-w-full h-auto"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}
