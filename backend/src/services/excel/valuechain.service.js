const { getCellLink } = require("./excel-reader.service");

function parseValueChain(rawData, sheet) {
  const headers = rawData[3];
  const rows = rawData.slice(4);
  return rows
    .map((row, i) => ({ row, sheetRow: 4 + i }))
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
      return item;
    });
}

module.exports = {
  parseValueChain,
};