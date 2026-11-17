import JSZip from "jszip";

const employeeFields = [
  "firstName",
  "lastName",
  "email",
  "password",
  "phone",
  "userRole",
  "department",
  "designation",
  "educationalQualifications",
  "passportNumber",
  "joiningDate",
  "aadhaarNumber",
  "aadhaarFrontImage",
  "aadhaarBackImage",
  "panNumber",
  "panImage",
  "blankChequeImage",
  "bankName",
  "accountHolderName",
  "accountNumber",
  "ifscCode",
  "bankBranch",
  "profilePictureImage"
];

const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "password",
  "phone",
  "userRole",
  "department",
  "designation",
  "educationalQualifications",
  "joiningDate",
  "aadhaarNumber",
  "panNumber",
  "bankName",
  "accountHolderName",
  "accountNumber",
  "ifscCode",
  "bankBranch"
];

const imageFields = [
  "aadhaarFrontImage",
  "aadhaarBackImage",
  "panImage",
  "blankChequeImage",
  "profilePictureImage"
];

const requiredImageFields = imageFields.filter((field) => field !== "profilePictureImage");
const allowedImageTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"]
]);

const cellText = (value) => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof value === "object") return String(value.text || value.result || "").trim();
  return String(value).trim();
};

const validateRow = (employee, files = {}) => {
  const errors = [];
  requiredFields.forEach((field) => {
    if (!employee[field]) errors.push(`${field} is required`);
  });
  if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
    errors.push("email must be valid");
  }
  if (employee.password && employee.password.length < 8) {
    errors.push("password must be at least 8 characters");
  }
  if (employee.phone && !/^[0-9+() .-]{7,24}$/.test(employee.phone)) {
    errors.push("phone must be valid");
  }
  if (employee.userRole && !["employee", "manager"].includes(employee.userRole.toLowerCase())) {
    errors.push("userRole must be Employee or Manager");
  }
  if (employee.joiningDate) {
    const date = new Date(`${employee.joiningDate}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(employee.joiningDate) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== employee.joiningDate) {
      errors.push("joiningDate must use a valid YYYY-MM-DD date or an Excel date cell");
    }
  }
  if (employee.aadhaarNumber && !/^\d{12}$/.test(employee.aadhaarNumber)) {
    errors.push("aadhaarNumber must contain 12 digits");
  }
  if (employee.panNumber && !/^[A-Z]{5}\d{4}[A-Z]$/i.test(employee.panNumber)) {
    errors.push("panNumber must be a valid PAN number");
  }
  requiredImageFields.forEach((field) => {
    if (!files[field]) errors.push(`${field} image is required`);
  });
  return errors;
};

export const validateEmployeeRows = (rows) => {
  const emailCounts = new Map();
  rows.forEach(({ employee }) => {
    const email = String(employee.email || "").trim().toLowerCase();
    if (email) emailCounts.set(email, (emailCounts.get(email) || 0) + 1);
  });

  return rows.map((row) => {
    const email = String(row.employee.email || "").trim().toLowerCase();
    const errors = [
      ...validateRow(row.employee, row.files),
      ...(row.archiveErrors || [])
        .filter(({ field }) => !row.files[field])
        .map(({ message }) => message)
    ];
    if (email && emailCounts.get(email) > 1) errors.push("email is duplicated in this workbook");
    return { ...row, errors };
  });
};

export const downloadEmployeeTemplate = async () => {
  const zip = new JSZip();
  const xmlEscape = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
  const sheetRows = [
    ["Field", "Value"],
    ...employeeFields.map((field) => [field, ""])
  ];
  const sheets = [{ name: "Employee", id: 1 }];
  const contentTypes = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
    ...sheets.map((sheet) => `<Override PartName="/xl/worksheets/sheet${sheet.id}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`),
    '</Types>'
  ].join("");
  const workbookXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
    `<sheets>${sheets.map((sheet) => `<sheet name="${sheet.name}" sheetId="${sheet.id}" r:id="rId${sheet.id}"/>`).join("")}</sheets>`,
    '</workbook>'
  ].join("");
  const workbookRelationships = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    ...sheets.map((sheet) => `<Relationship Id="rId${sheet.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${sheet.id}.xml"/>`),
    `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`,
    '</Relationships>'
  ].join("");
  const sheetXml = sheetRows.map((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    const cells = row.map((value, columnIndex) => {
      const column = columnIndex === 0 ? "A" : "B";
      const style = columnIndex === 0 || rowIndex === 0 ? ' s="1"' : "";
      return `<c r="${column}${rowNumber}"${style} t="inlineStr"><is><t>${xmlEscape(value)}</t></is></c>`;
    }).join("");
    return `<row r="${rowNumber}">${cells}</row>`;
  }).join("");
  const worksheetXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>',
    '<cols><col min="1" max="1" width="30" customWidth="1"/><col min="2" max="2" width="42" customWidth="1"/></cols>',
    `<sheetData>${sheetXml}</sheetData>`,
    '<autoFilter ref="A1:B24"/>',
    '</worksheet>'
  ].join("");
  const stylesXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>',
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>',
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>',
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>',
    '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>',
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>',
    '</styleSheet>'
  ].join("");
  const rootRelationships = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>',
    '</Relationships>'
  ].join("");

  zip.file("[Content_Types].xml", contentTypes);
  zip.file("_rels/.rels", rootRelationships);
  zip.file("xl/workbook.xml", workbookXml);
  zip.file("xl/_rels/workbook.xml.rels", workbookRelationships);
  zip.file("xl/styles.xml", stylesXml);
  sheets.forEach((sheet) => zip.file(`xl/worksheets/sheet${sheet.id}.xml`, worksheetXml));
  const buffer = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  return buffer;
};

export const parseEmployeeSpreadsheet = async (spreadsheetFile, imageZipFile) => {
  if (spreadsheetFile.size > 10 * 1024 * 1024) throw new Error("Excel file must be 10 MB or smaller.");
  if (imageZipFile && imageZipFile.size > 100 * 1024 * 1024) throw new Error("Image ZIP must be 100 MB or smaller.");

  const readExcelFile = (await import("read-excel-file/browser")).default;
  return parseEmployeeRows(await readExcelFile(spreadsheetFile), imageZipFile);
};

export const parseEmployeeRows = async (spreadsheetRows, imageZipFile) => {
  if (imageZipFile && imageZipFile.size > 100 * 1024 * 1024) throw new Error("Image ZIP must be 100 MB or smaller.");
  if (!spreadsheetRows?.length) throw new Error("The Excel workbook does not contain any worksheets.");

  const sourceRows = [];
  for (const [sheetIndex, sheet] of spreadsheetRows.entries()) {
    const data = Array.isArray(sheet) ? sheet : sheet?.data;
    const sheetName = Array.isArray(sheet) ? `Sheet ${sheetIndex + 1}` : sheet?.sheet || `Sheet ${sheetIndex + 1}`;
    if (!data?.length) continue;

    const isVertical = String(data[0]?.[0] || "").trim().toLowerCase() === "field" &&
      String(data[0]?.[1] || "").trim().toLowerCase() === "value";
    if (isVertical) {
      const employee = {};
      data.slice(1).forEach(([field, value]) => {
        const key = cellText(field);
        if (employeeFields.includes(key)) employee[key] = cellText(value);
      });
      employee.userRole = String(employee.userRole || "").toLowerCase();
      if (Object.values(employee).some(Boolean)) sourceRows.push({ employee, rowLabel: sheetName });
      if (sourceRows.length) break;
      continue;
    }

    const headerMap = new Map();
    data[0].forEach((value, column) => {
      const header = cellText(value).toLowerCase();
      if (header) headerMap.set(header, column);
    });
    const matchingFields = employeeFields.filter((field) => headerMap.has(field.toLowerCase()));
    if (!matchingFields.length) throw new Error(`${sheetName}: no employee fields were found in the header row.`);
    data.slice(1).forEach((row, index) => {
      const employee = {};
      employeeFields.forEach((field) => {
        const column = headerMap.get(field.toLowerCase());
        const value = column === undefined ? "" : cellText(row[column]);
        employee[field] = field === "userRole" ? value.toLowerCase() : value;
      });
      if (Object.values(employee).some(Boolean)) sourceRows.push({ employee, rowLabel: `${sheetName} row ${index + 2}` });
    });
    if (sourceRows.length) break;
  }
  if (!sourceRows.length) throw new Error("No employee data was found. Fill at least one employee worksheet.");
  if (sourceRows.length > 100) throw new Error("Import up to 100 employees per workbook.");

  const imageEntries = new Map();
  if (imageZipFile) {
    const zip = await JSZip.loadAsync(imageZipFile);
    Object.values(zip.files).forEach((entry) => {
      if (entry.dir) return;
      const basename = entry.name.replace(/\\/g, "/").split("/").pop().toLowerCase();
      const extension = basename.slice(basename.lastIndexOf("."));
      if (!allowedImageTypes.has(extension)) return;
      const matches = imageEntries.get(basename) || [];
      matches.push(entry);
      imageEntries.set(basename, matches);
    });
  }

  const rows = [];
  const imageFileCache = new Map();
  let totalImageBytes = 0;
  for (const [rowIndex, sourceRow] of sourceRows.entries()) {
    const { employee, rowLabel } = sourceRow;
    const files = {};
    const archiveErrors = [];
    for (const field of imageFields) {
      const filename = employee[field];
      delete employee[field];
      if (!filename) continue;
      const basename = filename.replace(/\\/g, "/").split("/").pop().toLowerCase();
      const matches = imageEntries.get(basename) || [];
      if (matches.length !== 1) {
        if (field !== "profilePictureImage") {
          archiveErrors.push({
            field,
            message: matches.length
              ? `${field}: ${filename} matches multiple ZIP files`
              : imageZipFile
                ? `${field}: ${filename} was not found in the ZIP`
                : `${field}: upload ${filename} manually or provide the ZIP archive`
          });
        }
        continue;
      }
      const entry = matches[0];
      const cachedFile = imageFileCache.get(entry.name);
      if (cachedFile) {
        files[field] = cachedFile;
        continue;
      }
      if (entry._data?.uncompressedSize > 5 * 1024 * 1024) {
        archiveErrors.push({ field, message: `${field}: ${filename} exceeds the 5 MB limit` });
        continue;
      }
      const blob = await entry.async("blob");
      if (blob.size > 5 * 1024 * 1024) {
        archiveErrors.push({ field, message: `${field}: ${filename} exceeds the 5 MB limit` });
        continue;
      }
      totalImageBytes += blob.size;
      if (totalImageBytes > 100 * 1024 * 1024) {
        throw new Error("The uncompressed images exceed the 100 MB import limit.");
      }
      const extension = basename.slice(basename.lastIndexOf("."));
      const imageFile = new File([blob], basename, { type: allowedImageTypes.get(extension) });
      imageFileCache.set(entry.name, imageFile);
      files[field] = imageFile;
    }

    rows.push({ rowNumber: rowIndex + 1, rowLabel, employee, files, archiveErrors });
  }
  if (!rows.length) throw new Error("No employee data rows were found.");
  return validateEmployeeRows(rows);
};
