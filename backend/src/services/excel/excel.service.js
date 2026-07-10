const XLSX = require("xlsx");

const { downloadExcelFile } = require("../graph/graph.service");
const { parseLongList } = require("./longlist.service");
const { parseValueChain } = require("./valuechain.service");
const { parseCalendar } = require("./calendar.service");

const { getWorkbook } = require("./excel-reader.service");

function sheetToRawData(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

async function getAllDashboardData() {
  const fileBuffer = await downloadExcelFile();
  const workbook = getWorkbook(fileBuffer);

  const longList = parseLongList(
    sheetToRawData(workbook, "Long List of Solution packages")
  );
  const valueChain = parseValueChain(
    sheetToRawData(workbook, "Value chain")
  );
  const calendar = parseCalendar(
    sheetToRawData(workbook, "Calendar_benchmarking solutions")
  );

  return { longList, valueChain, calendar };
}

module.exports = {
  getAllDashboardData,
};
