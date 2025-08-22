import { CalenderIcon } from "@/icons";
import Container from "@/components/container/Container";
import { Link } from "react-router";

export default function CTASection() {
    return (
        <section id="cta" className="py-10">
            <Container>
                <div className="bg-brand-500 text-white text-center rounded-2xl shadow-theme-lg py-16 px-6">
                    <h3 className="text-title-sm font-bold mb-4">
                        Buat janji temu dengan kami sekarang
                    </h3>
                    <p className="mb-6 mx-auto px-8 text-theme-sm max-w-xl">
                        Dapatkan bimbingan serta dukungan profesional melalui layanan konseling online maupun offline yang mudah diakses dan nyaman. Kami siap membantu Anda dalam menghadapi tantangan akademik, pribadi, maupun karir.
                    </p>
                    <Link to="/signup">
                        <button className="bg-white text-brand-500 text-theme-sm font-bold rounded-full px-6 py-3 mx-4 inline-flex items-center gap-2 shadow-theme-sm hover:bg-brand-50 transition">
                            <CalenderIcon className="" />
                            Buat Janji Temu
                        </button>
                    </Link>
                </div>
            </Container>
        </section>
    );
}
