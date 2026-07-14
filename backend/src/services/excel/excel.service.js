const XLSX = require("xlsx");

const { downloadExcelFile } = require("../graph/graph.service");
const { parseLongList } = require("./longlist.service");
const { parseValueChain } = require("./valuechain.service");
const { parseCalendar } = require("./calendar.service");

const { getWorkbook } = require("./excel-reader.service");

function sheetToRawData(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

async function getAllDashboardData() {
  const fileBuffer = await downloadExcelFile();
  const workbook = getWorkbook(fileBuffer);

  const longListSheet = workbook.Sheets["Long List of Solution packages"];
  const valueChainSheet = workbook.Sheets["Value chain"];
  const calendarSheet = workbook.Sheets["Calendar_benchmarking solutions"];

  const longList = parseLongList(sheetToRawData(longListSheet), longListSheet);
  const valueChain = parseValueChain(sheetToRawData(valueChainSheet), valueChainSheet);
  const calendar = parseCalendar(sheetToRawData(calendarSheet), calendarSheet);

  return { longList, valueChain, calendar };
}

module.exports = {
  getAllDashboardData,
};
