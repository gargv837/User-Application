export function convertToCSV(rows: any[]) {
    if (!rows.length) return "";
  
    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(",")];
  
    for (const row of rows) {
      const values = headers.map((h) => JSON.stringify(row[h] ?? ""));
      csvRows.push(values.join(","));
    }
  
    return csvRows.join("\n");
  }
  
  export function downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(url);
  }
  