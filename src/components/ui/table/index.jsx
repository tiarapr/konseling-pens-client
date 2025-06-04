// Table Component
const Table = ({ children, className }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell = ({
  children,
  isHeader = false,
  className,
  onClick,
  sortable,
  sortDirection,
  defaultSort = "asc",
  ...rest
}) => {
  const CellTag = isHeader ? "th" : "td";

  const getSortIndicator = () => {
    if (!sortable) return null;

    if (sortDirection === "asc") {
      return (
        <span className="ml-1 text-gray-800 dark:text-white">
          {defaultSort === "asc" ? "↑" : "↓"}
        </span>
      );
    }

    if (sortDirection === "desc") {
      return (
        <span className="ml-1 text-gray-800 dark:text-white">
          {defaultSort === "asc" ? "↓" : "↑"}
        </span>
      );
    }

    return (
      <span className="ml-1 flex flex-col">
        <span className="text-xs text-gray-300 dark:text-gray-500">
          {defaultSort === "asc" ? "↓" : "↑"}
        </span>
      </span>
    );
  };

  return (
    <CellTag
      className={`${className} ${sortable ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" : ""}`}
      onClick={onClick}
      {...rest}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIndicator()}
      </div>
    </CellTag>
  );
};


export { Table, TableHeader, TableBody, TableRow, TableCell };
