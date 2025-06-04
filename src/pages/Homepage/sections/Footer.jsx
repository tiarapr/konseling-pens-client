import Container from "../../../components/container/Container";
import LogoWhite from "/images/logo/LogoWhite.png";
import { FaYoutube, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer id="footer" className="bg-brand-500 text-white pt-12 pb-6 mt-16">
            <Container>
                <div className="px-4 md:px-16">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/3">
                            <img src={LogoWhite} alt="Logo" className="h-8 lg:h-10 mb-3" />
                            <p className="text-theme-sm mb-4 opacity-80">
                                Jl. Raya ITS Sukolilo Kampus PENS
                            </p>
                            <div className="flex gap-4 text-2xl">
                                <a href="#"><FaYoutube /></a>
                                <a href="#"><FaFacebookF /></a>
                                <a href="#"><FaWhatsapp /></a>
                            </div>
                        </div>
                        <div className="md:w-2/3 mt-2 flex flex-col md:flex-row justify-end gap-12 lg:gap-22">
                            <div>
                                <p className="font-bold mb-3">Informasi</p>
                                <ul className="space-y-2 text-theme-sm opacity-80">
                                    <li><a href="#" className="hover:underline">Tentang Kami</a></li>
                                    <li><a href="#" className="hover:underline">Info Layanan</a></li>
                                    <li><a href="#" className="hover:underline">Buat Janji Temu</a></li>
                                    <li><a href="#" className="hover:underline">FAQ</a></li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-bold mb-3">Kontak Kami</p>
                                <ul className="space-y-2 text-theme-sm opacity-80">
                                    <li>+626564465455</li>
                                    <li>info@klinik24.com</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-10 border-t border-white/55 pt-6">
                        <p className="text-theme-xs opacity-60">
                            © {new Date().getFullYear()} E-Counseling PENS. All rights reserved.
                        </p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
