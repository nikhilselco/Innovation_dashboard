const XLSX = require("xlsx");

function getWorkbook(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
  });
  return workbook;
}

function getCellLink(sheet, r, c) {
  const addr = XLSX.utils.encode_cell({ r, c });
  const cell = sheet[addr];
  return cell && cell.l && cell.l.Target ? cell.l.Target : null;
}

module.exports = {
  getWorkbook,
  getCellLink,
};
