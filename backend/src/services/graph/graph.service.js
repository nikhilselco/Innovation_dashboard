const axios = require("axios");
const { getAccessToken } = require("./auth.service");
const { driveId, fileId } = require("../../config/graph.config");

async function downloadExcelFile() {
  const token = await getAccessToken();
  const metadataResponse = await axios.get(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${fileId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const downloadUrl = metadataResponse.data["@microsoft.graph.downloadUrl"];
  const fileResponse = await axios.get(downloadUrl, {
    responseType: "arraybuffer",
  });
  return fileResponse.data;
}

module.exports = {
  downloadExcelFile,
};