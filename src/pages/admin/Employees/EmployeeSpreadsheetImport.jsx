import { useState } from "react";
import { downloadEmployeeTemplate, parseEmployeeSpreadsheet } from "./employeeSpreadsheet";

export default function EmployeeSpreadsheetImport({ onAdd, onClose }) {
  const [spreadsheetFile, setSpreadsheetFile] = useState(null);
  const [imageZipFile, setImageZipFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const downloadTemplate = async () => {
    try {
      const blob = await downloadEmployeeTemplate();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "employee-import-template.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError.message || "Unable to download the Excel template.");
    }
  };

  const addEmployee = async (event) => {
    event.preventDefault();
    if (!spreadsheetFile) {
      setError("Choose an Excel workbook to add an employee.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const rows = await parseEmployeeSpreadsheet(spreadsheetFile, imageZipFile);
      if (rows.length !== 1) {
        throw new Error("Use one employee row in the first non-empty worksheet.");
      }
      onAdd(rows[0]);
    } catch (addError) {
      setError(addError.message || "Unable to read the Excel workbook and image ZIP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="employee-import-panel" aria-label="Add employee from Excel">
      <header className="employee-import-heading">
        <div>
          <h2>Add Employee from Excel</h2>
          <p>Click Add to open the employee form with spreadsheet values filled in. Complete any remaining fields in the form.</p>
        </div>
        <button className="employee-cancel-button" type="button" onClick={onClose}>Back to Manual Entry</button>
      </header>

      <div className="employee-import-tools">
        <button className="employee-cancel-button" type="button" onClick={downloadTemplate}>Download Excel Template</button>
        <p>Use one employee per workbook. The template contains one worksheet. An image ZIP is optional; missing documents can be uploaded in the employee form.</p>
      </div>

      <form className="employee-import-file-form" onSubmit={addEmployee}>
        <label>Excel Workbook (.xlsx)
          <input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(event) => { setSpreadsheetFile(event.target.files?.[0] || null); setError(""); }}
          />
        </label>
        <label>Image Archive (.zip, optional)
          <input
            type="file"
            accept=".zip,application/zip"
            onChange={(event) => { setImageZipFile(event.target.files?.[0] || null); setError(""); }}
          />
        </label>
        <button className="employee-add-button" type="submit" disabled={loading || !spreadsheetFile}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <p className="employee-error" role="alert">{error}</p>}
    </section>
  );
}
