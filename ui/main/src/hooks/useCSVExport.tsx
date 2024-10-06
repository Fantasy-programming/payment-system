import { useCallback } from "react";

type CSVRow = Record<string, string | number | boolean | Date>;

export const useCSVExport = () => {
  const exportToCSV = useCallback(
    <T extends CSVRow>(rows: T[], filename: string = "export.csv") => {
      if (rows.length === 0) {
        alert("No data to export");
        console.warn("No data to export");
        return;
      }

      const headers = Object.keys(rows[0]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              if (typeof value === "string") {
                return `"${value.replace(/"/g, '""')}"`;
              }
              if (value instanceof Date) {
                return value.toISOString();
              }
              return value;
            })
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [],
  );

  return { exportToCSV };
};
