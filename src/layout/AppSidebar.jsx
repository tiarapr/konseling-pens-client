import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Perhatikan perubahan di sini (react-router -> react-router-dom)
import {
    CalenderIcon,
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
    ListIcon,
    PageIcon,
    UserCircleIcon,
    GroupIcon,
    UserIcon,
    SignOutIcon,
    TableIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

const menuItemsByRole = {
    master: [
        {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/master-dashboard",
        },
        {
            name: "Janji Temu",
            icon: <ListIcon />,
            path: "/master-dashboard/janji-temu",
        },
        {
            name: "Manajemen Konseling",
            icon: <CalenderIcon />,
            subItems: [
                { name: "Data Konseling", path: "/master-dashboard/konseling" },
                { name: "Jadwal Konseling", path: "/master-dashboard/jadwal-konseling" },
                { name: "Riwayat Konseling", path: "/master-dashboard/riwayat-konseling" },
            ],
        },
        {
            name: "Manajemen User",
            icon: <GroupIcon />,
            subItems: [
                { name: "Data Mahasiswa", path: "/master-dashboard/user/mahasiswa" },
                { name: "Data Admin", path: "/master-dashboard/user/admin" },
                { name: "Data Konselor", path: "/master-dashboard/user/konselor" },
                { name: "Data Kemahasiswaan", path: "/master-dashboard/user/kemahasiswaan" },
            ],
        },
        {
            name: "Role & Permission",
            icon: <UserIcon />,
            subItems: [
                { name: "Data Role", path: "/master-dashboard/role" },
                { name: "Data Permission", path: "/master-dashboard/permission" },
                { name: "Data Role & Permission", path: "/master-dashboard/role-permission" },
            ],
        },
        {
            name: "Departemen & Prodi",
            icon: <TableIcon />,
            subItems: [
                { name: "Data Departement", path: "/master-dashboard/departement" },
                { name: "Data Program Studi", path: "/master-dashboard/program-studi" },
            ],
        }
    ],
    mahasiswa: [
        {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/dashboard",
        },
        {
            name: "Janji Temu",
            icon: <ListIcon />,
            path: "/dashboard/janji-temu",
        },
        {
            name: "Data Konseling",
            icon: <CalenderIcon />,
            subItems: [
                { name: "Data Konseling", path: "/dashboard/konseling" },
                { name: "Jadwal Konseling", path: "/dashboard/jadwal-konseling" },
                { name: "Riwayat Konseling", path: "/dashboard/riwayat-konseling" },
            ],
        },
        {
            name: "Setting Account",
            icon: <UserIcon />,
            path: "/dashboard/setting/account",
        },
    ],
    admin: [
        {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/admin-dashboard",
        },
        {
            name: "Mahasiswa",
            icon: <GroupIcon />,
            path: "/admin-dashboard/mahasiswa",
        },
        {
            name: "Janji Temu",
            icon: <ListIcon />,
            path: "/admin-dashboard/janji-temu",
        },
        {
            name: "Manajemen Konseling",
            icon: <CalenderIcon />,
            subItems: [
                { name: "Data Konseling", path: "/admin-dashboard/konseling" },
                { name: "Jadwal Konseling", path: "/admin-dashboard/jadwal-konseling" },
            ],
        },
        {
            name: "Konselor",
            icon: <GroupIcon />,
            path: "/admin-dashboard/konselor",
        },
        {
            name: "My Profile",
            icon: <UserIcon />,
            path: "/admin-dashboard/profile",
        },
    ],
    konselor: [
        {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/konselor-dashboard",
        },
        {
            name: "Mahasiswa",
            icon: <GroupIcon />,
            path: "/konselor-dashboard/mahasiswa",
        },
        {
            name: "Manajemen Konseling",
            icon: <CalenderIcon />,
            subItems: [
                { name: "Data Konseling", path: "/konselor-dashboard/konseling" },
                { name: "Jadwal Konseling", path: "/konselor-dashboard/jadwal-konseling" },
                { name: "Riwayat Konseling", path: "/konselor-dashboard/riwayat-konseling" },
            ],
        },
        {
            name: "My Profile",
            icon: <UserIcon />,
            path: "/konselor-dashboard/profile",
        },
    ],
    kemahasiswaan: [
        {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/kemahasiswaan-dashboard",
        },
        {
            name: "Data Mahasiswa",
            icon: <GroupIcon />,
            path: "/kemahasiswaan-dashboard/mahasiswa",
        },
        {
            name: "Janji Temu",
            icon: <ListIcon />,
            path: "/kemahasiswaan-dashboard/janji-temu",
        },
        {
            name: "Data Konseling",
            icon: <CalenderIcon />,
            subItems: [
                { name: "Data Konseling", path: "/kemahasiswaan-dashboard/konseling" },
                { name: "Jadwal Konseling", path: "/kemahasiswaan-dashboard/jadwal-konseling" },
            ],
        },
        {
            name: "Manajemen User",
            icon: <GroupIcon />,
            subItems: [
                { name: "Data Admin", path: "/kemahasiswaan-dashboard/user/admin" },
            ],
        },
        {
            name: "My Profile",
            icon: <UserIcon />,
            path: "/kemahasiswaan-dashboard/profile",
        },
    ]
};

const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const { user } = useAuth();

    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});

    // Dapatkan menu items berdasarkan role user
    const navItems = menuItemsByRole[user?.role_name] || [];

    const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

    useEffect(() => {
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : [];
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({ type: menuType, index });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        if (!submenuMatched) setOpenSubmenu(null);
    }, [location, isActive, navItems]);

    useEffect(() => {
        if (openSubmenu) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index, menuType) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (prevOpenSubmenu?.type === menuType && prevOpenSubmenu?.index === index) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (items, menuType) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                        >
                            <span className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                            {(isExpanded || isHovered || isMobileOpen) && <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />}
                        </button>
                    ) : (
                        nav.path && (
                            <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }} className="overflow-hidden transition-all duration-300" style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}>
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
                } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                <Link to="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <img className="dark:hidden" src="/images/logo/Dashboard Logo 1 - Blue.png" alt="Logo" width={180} height={40} />
                            <img className="hidden dark:block" src="/images/logo/Dashboard Logo 2 - White.png" alt="Logo" width={180} height={40} />
                        </>
                    ) : (
                        <img src="/images/logo/DashboardIcon.png" alt="Logo" width={32} height={32} />
                    )}
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        {navItems.length > 0 && (
                            <div>
                                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                                    }`}>
                                    {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
                                </h2>
                                {renderMenuItems(navItems, "main")}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;