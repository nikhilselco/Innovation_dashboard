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
      return item;
    });
}

module.exports = {
  parseCalendar,
};