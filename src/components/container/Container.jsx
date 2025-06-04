export default function Container({ children, className = "" }) {
  return (
    <div className={`max-w-screen-2xl mx-auto px-4 md:px-16 ${className}`}>
      {children}
    </div>
  );
}