import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import SearchInput from "./SearchInput";
import LimitSelector from "./LimitSelector";
import Pagination from "./Pagination";
import { filterData, sortData, paginateData, getNestedValue } from "./helpers";

const DataTable = ({
  data = [],
  columns = [],
  defaultSort = { key: "", direction: "asc" }, 
  searchable = true,
  pagination = true,
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 5,
  onAddClick,
  addButtonText = "+ Tambah Data",
  addButtonLink,
  addButtonComponent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortConfig, setSortConfig] = useState(defaultSort);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let filteredData = data;

    if (searchTerm && searchable) {
      filteredData = filterData(filteredData, searchTerm);
    }

    if (sortConfig?.key) {
      filteredData = sortData(filteredData, sortConfig);
    }

    if (pagination) {
      return paginateData(filteredData, currentPage, itemsPerPage);
    }

    return filteredData;
  }, [data, searchTerm, sortConfig, currentPage, itemsPerPage, searchable, pagination]);

  const totalItems = useMemo(() => {
    if (searchTerm && searchable) {
      return filterData(data, searchTerm).length;
    }
    return data.length;
  }, [data, searchTerm, searchable]);

  const renderCellContent = (item, column) => {
    if (column.render) return column.render(item);
    return getNestedValue(item, column.key);
  };

  return (
    <div className="space-y-4">
      {/* Search dan Limit */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="w-full sm:w-auto">
          {pagination && (
            <LimitSelector
              itemsPerPage={itemsPerPage}
              onChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
              options={itemsPerPageOptions}
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto justify-end">
          {addButtonComponent ? (
            addButtonComponent
          ) : addButtonLink ? (
            <a
              href={addButtonLink}
              className="w-full sm:w-fit p-2.5 text-theme-sm bg-gray-700 text-white rounded-lg text-center"
            >
              {addButtonText}
            </a>
          ) : onAddClick ? (
            <button
              onClick={onAddClick}
              className="w-full sm:w-fit p-2.5 text-theme-sm bg-gray-700 text-white rounded-lg"
            >
              {addButtonText}
            </button>
          ) : null}

          {searchable && (
            <SearchInput
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          )}
        </div>

      </div>


      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key || column.title}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-600 text-start text-theme-sm dark:text-gray-400 ${column.headerClassName || ""
                      }`}
                    onClick={() => column.sortable && requestSort(column.key)}
                    sortable={column.sortable}
                    sortDirection={sortConfig?.key === column.key ? sortConfig.direction : null}
                  >
                    {column.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {processedData.length > 0 ? (
                processedData.map((item, rowIndex) => (
                  <TableRow key={item.id || rowIndex}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.key || column.title}
                        className={`px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-600 dark:text-white ${column.cellClassName || ""
                          }`}
                      >
                        {renderCellContent(item, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-theme-sm"
                  >
                    <div className="w-full text-center">No data found</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination terpisah */}
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default DataTable;