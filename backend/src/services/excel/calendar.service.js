const XLSX = require("xlsx");
const { getCellLink } = require("./excel-reader.service");

const DATE_COLUMNS = [
  "Completion due date",
  "Review 1",
  "Review 2",
  "Review 3",
];

function excelSerialToDate(serial) {
  if (typeof serial !== "number") return serial;

  const parsed = XLSX.SSF.parse_date_code(serial);
  if (!parsed) return serial;

  const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  return date.toISOString().split("T")[0];
}

function parseCalendar(rawData, sheet) {
  const headers = rawData[3];
  const rows = rawData.slice(7);

  return rows
    .map((row, i) => ({ row, sheetRow: 7 + i }))
    .filter(({ row }) => row[2])
    .map(({ row, sheetRow }) => {
      const item = {};
      headers.forEach((header, index) => {
        let value = row[index];

        if (sheet) {
          const link = getCellLink(sheet, sheetRow, index);

          if (link) {
            if (typeof value === "string" && value.trim()) {
              if (!value.includes(link)) value = `${value} ${link}`;
            } else {
              value = link;
            }
          }
        }

        item[header] = value;
      });

      DATE_COLUMNS.forEach((column) => {
        if (column in item) {
          item[column] = excelSerialToDate(item[column]);
        }
      });

      return item;
    });
}

module.exports = {
  parseCalendar,
};
