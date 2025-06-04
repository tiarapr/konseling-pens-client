import { useSidebar } from "../context/SidebarContext";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null; // Don't render anything if the sidebar is not open

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden transition-opacity duration-300 ease-in-out"
      onClick={toggleMobileSidebar} // Close the sidebar when the backdrop is clicked
      aria-hidden="true" // Accessibility improvement to ignore this element for screen readers
    />
  );
};

export default Backdrop;
