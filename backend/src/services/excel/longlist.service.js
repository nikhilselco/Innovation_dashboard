const { getCellLink } = require("./excel-reader.service");

function parseLongList(rawData, sheet) {
  const headers = rawData[2];
  const rows = rawData.slice(3);

  return rows
    .map((row, i) => ({ row, sheetRow: 3 + i }))
    .filter(({ row }) => row[1])
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
  parseLongList,
};
