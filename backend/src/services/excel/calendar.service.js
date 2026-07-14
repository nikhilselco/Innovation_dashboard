const XLSX = require("xlsx");

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

function parseCalendar(rawData) {
  const headers = rawData[3];
  const rows = rawData.slice(7);

  return rows
    .filter((row) => row[2])
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index];
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
