import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "@/components/container/Container";
import LogoKonseling from "/images/logo/LogoPrimary.png";

const navItems = [
    { id: "beranda", label: "Beranda" },
    { id: "about", label: "Tentang Kami" },
    { id: "layanan", label: "Layanan" },
    { id: "footer", label: "Kontak Kami" },
];

export default function Header({ activeSection, scrolled, handleNavClick }) {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-shadow ${scrolled ? "shadow-theme-sm bg-white" : ""}`}>
            <Container>
                <div className="flex items-center justify-between py-3 mx-auto px-4 md:px-16">
                    <img src={LogoKonseling} alt="Logo" className="h-16" />

                    {/* Desktop nav */}
                    <nav className="nav-desktop hidden xl:flex gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`text-theme-sm font-medium px-3 py-2 rounded-lg transition ${activeSection === item.id
                                    ? "bg-brand-50 text-brand-500"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <Link
                        to="/signup"
                        className="hidden xl:inline-block bg-brand-500 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-theme-md hover:bg-brand-600 transition"
                    >
                        Registrasi Layanan
                    </Link>

                    {/* Hamburger Icon */}
                    <button onClick={toggleMobileMenu} className="hamburger-toggle xl:hidden focus:outline-none">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </Container>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 backdrop-blur-sm bg-gray-300"
                        onClick={closeMobileMenu}
                    />

                    <div className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg z-50 transition-transform transform translate-x-0 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <img src={LogoKonseling} alt="Logo" className="h-12" />
                            <button onClick={closeMobileMenu}>
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        handleNavClick(item.id);
                                        closeMobileMenu();
                                    }}
                                    className={`text-left font-medium text-lg px-2 py-2 rounded-md transition ${activeSection === item.id
                                        ? "bg-brand-50 text-brand-500"
                                        : "text-gray-800 hover:bg-gray-100"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <Link
                                to="/signup"
                                className="lg:inline-block mt-4 bg-brand-500 text-white rounded-full px-4 py-2 text-sm font-semibold shadow hover:bg-brand-600 transition text-center"
                                onClick={closeMobileMenu}
                            >
                                Registrasi Layanan
                            </Link>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
}
