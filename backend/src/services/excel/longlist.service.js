function parseLongList(rawData) {
  const headers = rawData[2];
  const rows = rawData.slice(3);

  return rows
    .filter((row) => row[1])
    .map((row) => {
      const item = {};

      headers.forEach((header, index) => {
        item[header] = row[index];
      });

      return item;
    });
}

module.exports = {
  parseLongList,
};
