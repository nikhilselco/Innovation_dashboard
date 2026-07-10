const XLSX = require("xlsx");

function getWorkbook(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
  });
  return workbook;
}

module.exports = {
  getWorkbook,
};