import React from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ReactDOMServer from "react-dom/server";

const DataExporter = ({
    data = [],
    columns = [],
    fileName = "data",
    renderCellContent = (item, column) => item[column.key],
}) => {
    const exportToExcel = () => {
        const exportColumns = columns.filter(col => !col.excludeFromExport);
        const headers = exportColumns.map(col => col.title);
        const rows = data.map(item =>
            exportColumns.map(col =>
                col.exportRenderer
                    ? col.exportRenderer(item)
                    : renderCellContent(item, col)
            )
        );
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const exportToPDF = () => {
        try {
            const exportColumns = columns.filter(col => !col.excludeFromExport);
            const headers = exportColumns.map(col => col.title);
            const rows = data.map(item =>
                exportColumns.map(col => {
                    const content = col.exportRenderer
                        ? col.exportRenderer(item)
                        : renderCellContent(item, col);

                    return React.isValidElement(content)
                        ? ReactDOMServer.renderToStaticMarkup(content)
                        : content;
                })
            );

            const doc = new jsPDF();

            // Gunakan fungsi autoTable() yang diimport, bukan method di doc
            autoTable(doc, {
                head: [headers],
                body: rows,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [55, 65, 81] },
            });

            doc.save(`${fileName}.pdf`);
        } catch (error) {
            console.error("Export PDF error:", error);
            alert("Gagal mengekspor ke PDF.");
        }
    };

    return (
        <select
            onChange={(e) => {
                if (e.target.value === "excel") exportToExcel();
                else if (e.target.value === "pdf") exportToPDF();
                e.target.value = "";
            }}
            className="block w-full px-3 py-3 text-theme-sm border text-gray-600 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white/90"
        >
            <option value="">Export Data</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
        </select>
    );
};

export default DataExporter;
