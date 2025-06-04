import { useState, useEffect } from "react";
import Header from "./sections/Header";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ServiceSection from "./sections/ServiceSection";
import CTASection from "./sections/CTASection";
import Footer from "./sections/Footer";

const sections = ["beranda", "about", "layanan", "footer"];

export default function HomePage() {
    const [activeSection, setActiveSection] = useState("beranda");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (section) => {
        setActiveSection(section);
        const el = document.getElementById(section);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 70,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="bg-gray-50 font-inter">
            <Header
                activeSection={activeSection}
                scrolled={scrolled}
                handleNavClick={handleNavClick}
            />
            <HeroSection />
            <main className="py-10">
                <div className="max-w-screen-2xl mx-auto px-4 md:px-16">
                    <AboutSection />
                    <ServiceSection />
                    <CTASection />
                </div>
            </main>
            <Footer />
        </div>
    );
}
